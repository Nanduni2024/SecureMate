import { View, Text, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { signIn } = useAuth();

    // Explicitly use the auth.expo.io proxy URI
    const redirectUri = "https://auth.expo.io/@naduni_2025/securemate";

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        redirectUri: redirectUri,
    });

    useEffect(() => {
        console.log('--- GOOGLE AUTH DEBUG ---');
        console.log('Generated Redirect URI:', redirectUri);
        if (request) {
            console.log('Request Redirect URI:', request.redirectUri);
        }
        console.log('-------------------------');
    }, [request, redirectUri]);

    const handleGoogleVerify = useCallback(async (token: string) => {
        setLoading(true);
        try {
            console.log('Sending token to:', api.defaults.baseURL + 'auth/google/verify');
            const res = await api.post('auth/google/verify', { credential: token });
            console.log('Backend verification success:', res.data);
            await signIn(res.data.token);
            router.replace('/(tabs)');
        } catch (err: unknown) {
            console.error('Google Login Error:', err);
            if (isAxiosError(err)) {
                console.error('Backend Error Response:', err.response?.data);
                Alert.alert('Google Login Failed', err.response?.data?.msg || 'Could not verify with backend.');
            } else {
                Alert.alert('Google Login Failed', 'Network or Unknown Error');
            }
        } finally {
            setLoading(false);
        }
    }, [signIn, router]);

    useEffect(() => {
        console.log('Google Auth Response:', JSON.stringify(response, null, 2));
        if (response?.type === 'success') {
            const { id_token } = response.params;
            console.log('Google ID Token retrieved, verifying with backend...');
            handleGoogleVerify(id_token);
        } else if (response?.type === 'error') {
            console.error('Google Auth Error:', response.error);
            Alert.alert('Google Sign-In Error', response.error?.message || 'Authentication failed');
        }
    }, [response, handleGoogleVerify]);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        console.log('Attempting login for:', email);
        console.log('API Base URL:', api.defaults.baseURL);

        try {
            const res = await api.post('auth/login', {
                email,
                password,
            });

            console.log('Login successful, token received');
            await signIn(res.data.token);
            console.log('Sign-in context updated, navigating to (tabs)');
            router.replace('/(tabs)');
        } catch (err: unknown) {
            console.log('Login Error:', err);
            if (isAxiosError(err)) {
                console.log('Axios Error Response:', err.response?.data);
                console.log('Axios Error Config:', err.config);
                Alert.alert('Login Failed', err.response?.data?.msg || 'Invalid credentials');
            } else {
                Alert.alert('Login Failed', 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={tw`flex-1 bg-slate-950 justify-center px-6`}>
            {/* Header Section */}
            <View style={tw`items-center mb-8`}>
                <View style={tw`h-16 w-16 bg-blue-500/10 items-center justify-center rounded-2xl border border-blue-500/20 mb-4`}>
                    <MaterialCommunityIcons name="shield-check" size={32} color="#3b82f6" />
                </View>
                <Text style={tw`text-3xl font-bold text-white mb-2`}>SecureMate</Text>
                <Text style={tw`text-slate-400 text-center`}>Enter your credentials to access the vault</Text>
            </View>

            {/* Form Section */}
            <View style={tw`mb-8 gap-4`}>
                <View>
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="user@example.com"
                    />
                </View>
                <View>
                    <Input
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholder="••••••••"
                    />
                </View>
            </View>

            <View style={tw`gap-4`}>
                <Button
                    title="Sign In"
                    onPress={handleLogin}
                    loading={loading}
                />

                <View style={tw`flex-row items-center justify-center gap-4 my-2`}>
                    <View style={tw`h-[1px] bg-slate-800 flex-1`} />
                    <Text style={tw`text-slate-500`}>OR</Text>
                    <View style={tw`h-[1px] bg-slate-800 flex-1`} />
                </View>

                <Button
                    title="Sign in with Google"
                    onPress={() => promptAsync()}
                    variant="outline"
                    icon={<MaterialCommunityIcons name="google" size={20} color="white" />}
                    loading={loading}
                    disabled={!request}
                />
            </View>

            <View style={tw`flex-row justify-center mt-6`}>
                <Text style={tw`text-slate-400 mr-1`}>No account yet?</Text>
                <Text
                    style={tw`text-blue-500 font-bold`}
                    onPress={() => router.push('/register')}
                >
                    Register
                </Text>
            </View>
        </View>
    );
}
