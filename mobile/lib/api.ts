import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const normalizeBaseUrl = (url: string) => (url.endsWith('/') ? url : `${url}/`);

const PROD_BASE_URL = 'https://securemate-backend-env.up.railway.app/api/';

const getBaseUrl = () => {
    // Priority 1: Environment variable if defined (e.g. for CI or local dev overrides)
    const envApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
    if (envApiUrl) {
        return normalizeBaseUrl(envApiUrl);
    }

    // Priority 2: Platform-specific defaults for local development EMULATORS/SIMULATORS
    // We check this BEFORE app.json/LAN IP because if we are in an emulator, 
    // we almost always want 10.0.2.2 or localhost.
    if (Platform.OS === 'android' && !Constants.isDevice) {
        return 'http://10.0.2.2:5000/api/';
    }
    if (Platform.OS === 'ios' && !Constants.isDevice) {
        return 'http://localhost:5000/api/';
    }
    if (Platform.OS === 'web') {
        return 'http://localhost:5000/api/';
    }

    const extraApiUrl = Constants.expoConfig?.extra?.apiUrl as string | undefined;
    const extraLanIp = Constants.expoConfig?.extra?.lanIp as string | undefined;

    // Priority 3: app.json extra (production Railway backend or custom server URL)
    // Only use if it looks like a real production URL or if explicitly set for dev
    if (extraApiUrl?.trim()) {
        return normalizeBaseUrl(extraApiUrl.trim());
    }

    // Priority 4: Dynamic hostUri from Expo (best for physical devices on same Wi-Fi)
    const hostUri =
        Constants.expoConfig?.hostUri ||
        Constants.manifest2?.extra?.expoClient?.hostUri ||
        Constants.manifest?.hostUri;

    if (hostUri) {
        const host = hostUri.split(':')[0];
        if (!host.includes('exp.direct') && !host.includes('localhost') && host !== '127.0.0.1' && !host.includes('.proxy.')) {
            return `http://${host}:5000/api/`;
        }
    }

    // Priority 5: Fallback to LAN IP if provided in extra
    if (extraLanIp?.trim()) {
        return `http://${extraLanIp.trim()}:5000/api/`;
    }

    // Final fallback: Production Railway backend
    return PROD_BASE_URL;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                config.headers['x-auth-token'] = token;
            }
        } catch (error) {
            console.error('[API] Error fetching token:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        console.log(`[API Success] ${response.config.method?.toUpperCase()} ${response.config.url}`);
        return response;
    },
    async (error) => {
        if (axios.isAxiosError(error)) {
            const errorDetails = {
                message: error.message,
                code: error.code,
                url: error.config?.url,
                fullUrl: (error.config?.baseURL || '') + (error.config?.url || ''),
                method: error.config?.method?.toUpperCase(),
                status: error.response?.status,
                data: error.response?.data,
                headers: error.config?.headers,
            };

            console.error('[API Error Detailed]', JSON.stringify(errorDetails, null, 2));

            if (error.code === 'ERR_NETWORK') {
                console.warn('[API Warning] Network Error - This usually means the server is unreachable or CORS blocked the request.');
                console.warn('Check if:', errorDetails.fullUrl, 'is correct and the server is running.');
                const config = error.config;
                const alreadyRetried = (config as { _fallbackRetried?: boolean } | undefined)?._fallbackRetried;
                if (config && !alreadyRetried && config.baseURL && config.baseURL !== PROD_BASE_URL) {
                    console.warn('[API Warning] Retrying with production backend...');
                    (config as { _fallbackRetried?: boolean })._fallbackRetried = true;
                    config.baseURL = PROD_BASE_URL;
                    return api.request(config);
                }
            }
        } else {
            console.error('[API Native Error]', error);
        }
        return Promise.reject(error);
    }
);

export default api;
