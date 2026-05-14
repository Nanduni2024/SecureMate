import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator, Image } from 'react-native';
import tw from 'twrnc';
import logo from '../assets/images/logo.png';

export default function Index() {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-slate-950`}>
                <Image
                    source={logo}
                    style={tw`w-32 h-32 mb-8`}
                    resizeMode="contain"
                />
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (!token) {
        return <Redirect href="/login" />;
    }

    return <Redirect href="/(tabs)" />;
}
