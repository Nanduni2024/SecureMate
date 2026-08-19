import { View, Text, Alert, ScrollView } from 'react-native';
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

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
        console.log('--- GOOGLE AUTH DEBUG (Register) ---');
        console.log('Generated Redirect URI:', redirectUri);
        if (request) {
            console.log('Request Redirect URI:', request.redirectUri);
        }
        console.log('-------------------------');
    }, [request, redirectUri]);

    const handleGoogleVerify = useCallback(async (token: string) => {
        setLoading(true);
        try {
            const res = await api.post('auth/google/verify', { credential: token });
            await signIn(res.data.token);
            router.replace('/(tabs)');
        } catch (err: unknown) {
            console.error('Google Sign-Up Error:', err);
            if (isAxiosError(err)) {
                Alert.alert('Google Sign-Up Failed', err.response?.data?.msg || 'Could not verify with backend.');
            } else {
                Alert.alert('Google Sign-Up Failed', 'Network or Unknown Error');
            }
        } finally {
            setLoading(false);
        }
    }, [signIn, router]);

    useEffect(() => {
        console.log('Google Auth Response:', JSON.stringify(response, null, 2));
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleVerify(id_token);
        } else if (response?.type === 'error') {
            Alert.alert('Google Sign-Up Error', response.error?.message || 'Authentication failed');
        }
    }, [response, handleGoogleVerify]);

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        console.log('[Register] Attempting registration for:', email);

        try {
            const res = await api.post('auth/register', {
                email,
                password,
            });

            console.log('[Register] Registration successful, token received');
            await signIn(res.data.token);
            console.log('[Register] Sign-in context updated, navigating to (tabs)');
            router.replace('/(tabs)');
        } catch (err: unknown) {
            console.log('[Register] Registration Error:', err);
            if (isAxiosError(err)) {
                Alert.alert('Registration Failed', err.response?.data?.msg || 'Could not create account');
            } else {
                Alert.alert('Registration Failed', 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={tw`flex-grow bg-slate-950 justify-center px-6 py-12`}>
            {/* Header Section */}
            <View style={tw`items-center mb-8`}>
                <View style={tw`h-16 w-16 bg-blue-500/10 items-center justify-center rounded-2xl border border-blue-500/20 mb-4`}>
                    <MaterialCommunityIcons name="account-plus" size={32} color="#3b82f6" />
                </View>
                <Text style={tw`text-3xl font-bold text-white mb-2`}>Create Account</Text>
                <Text style={tw`text-slate-400 text-center`}>Join SecureMate and secure your digital life</Text>
            </View>

            {/* Form Section */}
            <View style={tw`mb-8 gap-4`}>
                <View>
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="user@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
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
                <View>
                    <Input
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholder="••••••••"
                    />
                </View>
            </View>

            <View style={tw`gap-4`}>
                <Button
                    title="Register"
                    onPress={handleRegister}
                    loading={loading}
                />

                <View style={tw`flex-row items-center justify-center gap-4 my-2`}>
                    <View style={tw`h-[1px] bg-slate-800 flex-1`} />
                    <Text style={tw`text-slate-500`}>OR</Text>
                    <View style={tw`h-[1px] bg-slate-800 flex-1`} />
                </View>

                <Button
                    title="Sign up with Google"
                    onPress={() => promptAsync()}
                    variant="outline"
                    icon={<MaterialCommunityIcons name="google" size={20} color="white" />}
                    loading={loading}
                    disabled={!request}
                />
            </View>

            <View style={tw`flex-row justify-center mt-6`}>
                <Text style={tw`text-slate-400 mr-1`}>Already have an account?</Text>
                <Text
                    style={tw`text-blue-500 font-bold`}
                    onPress={() => router.back()}
                >
                    Login
                </Text>
            </View>
        </ScrollView>
    );
}
