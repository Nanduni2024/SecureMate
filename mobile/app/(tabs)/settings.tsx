import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import tw from 'twrnc';
import { useAuth } from '../../hooks/useAuth';
import { decodeJwt } from '../../utils/jwt';
import {
    User, LogOut, Bell, Shield, ChevronRight,
    Smartphone, Moon, Info, Mail
} from 'lucide-react-native';

interface SettingItemProps {
    icon: React.ComponentType<{ size: number; color: string }>;
    title: string;
    value?: string;
    onPress?: () => void;
    color?: string;
}

export default function SettingsScreen() {
    const { token, signOut } = useAuth();
    const user = token ? decodeJwt(token) : null;
    const userEmail = user?.user?.email || user?.email || 'User';

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: signOut }
            ]
        );
    };

    const SettingItem = ({ icon: Icon, title, value, onPress, color = "text-slate-200" }: SettingItemProps) => (
        <TouchableOpacity
            onPress={onPress}
            style={tw`flex-row items-center justify-between py-4 border-b border-slate-800`}
        >
            <View style={tw`flex-row items-center`}>
                <View style={tw`w-10 h-10 bg-slate-900 items-center justify-center rounded-lg mr-3`}>
                    <Icon size={20} color="#94a3b8" />
                </View>
                <View>
                    <Text style={tw`text-sm font-semibold ${color}`}>{title}</Text>
                    {value && <Text style={tw`text-slate-500 text-xs mt-0.5`}>{value}</Text>}
                </View>
            </View>
            <ChevronRight size={18} color="#475569" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={tw`flex-1 bg-slate-950 pt-12`}>
            {/* Header / Profile */}
            <View style={tw`px-6 mb-8 items-center`}>
                <View style={tw`h-24 w-24 bg-blue-500/10 items-center justify-center rounded-full border-2 border-blue-500/20 mb-4`}>
                    <User size={40} color="#3b82f6" />
                </View>
                <Text style={tw`text-xl font-bold text-white`}>{userEmail}</Text>
                <View style={tw`bg-emerald-500/10 px-3 py-1 rounded-full mt-2`}>
                    <Text style={tw`text-emerald-500 text-[10px] font-bold uppercase tracking-wider`}>Pro Account</Text>
                </View>
            </View>

            {/* Settings Sections */}
            <View style={tw`px-6 gap-6`}>
                <View>
                    <Text style={tw`text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2 px-1`}>Account</Text>
                    <View style={tw`bg-slate-900/50 rounded-2xl px-4 border border-slate-800`}>
                        <SettingItem icon={User} title="Profile Details" value="Update your email and personal info" />
                        <SettingItem icon={Mail} title="Email Notifications" value="On" />
                        <SettingItem icon={Shield} title="Security & Privacy" value="2FA Enabled" />
                    </View>
                </View>

                <View>
                    <Text style={tw`text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2 px-1`}>App Settings</Text>
                    <View style={tw`bg-slate-900/50 rounded-2xl px-4 border border-slate-800`}>
                        <SettingItem icon={Bell} title="Push Notifications" />
                        <SettingItem icon={Moon} title="Dark Mode" value="System Default" />
                        <SettingItem icon={Smartphone} title="Device Sync" value="2 devices connected" />
                    </View>
                </View>

                <View>
                    <Text style={tw`text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2 px-1`}>Other</Text>
                    <View style={tw`bg-slate-900/50 rounded-2xl px-4 border border-slate-800 mb-8`}>
                        <SettingItem icon={Info} title="About SecureMate" value="v1.0.4 (stable)" />
                        <SettingItem
                            icon={LogOut}
                            title="Sign Out"
                            color="text-red-500"
                            onPress={handleLogout}
                        />
                    </View>
                </View>
            </View>
            <View style={tw`h-20`} />
        </ScrollView>
    );
}
