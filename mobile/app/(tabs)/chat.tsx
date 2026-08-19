import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import tw from 'twrnc';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import api from '@/lib/api';

interface Message {
    role: 'user' | 'model';
    content: string;
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const vibrateAnim = useRef(new Animated.Value(0)).current;

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        const nextMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(nextMessages);
        setIsLoading(true);

        try {
            const response = await api.post('chat', {
                message: userMessage,
                history: nextMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] }))
            });

            setMessages(prev => [...prev, { role: 'model', content: response.data.response }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'model', content: '**Error**: I encountered a network issue. Please check your connection and try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(vibrateAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                Animated.timing(vibrateAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
                Animated.timing(vibrateAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                Animated.timing(vibrateAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
                Animated.delay(2000)
            ])
        );

        loop.start();
        return () => loop.stop();
    }, [vibrateAnim]);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const markdownStyles: Record<string, object> = {
        body: { color: '#e2e8f0', fontSize: 13, lineHeight: 20 },
        strong: { color: '#fff', fontWeight: 'bold' },
        link: { color: '#3b82f6' },
        code_inline: { backgroundColor: '#1e293b', color: '#60a5fa', padding: 4, borderRadius: 4 },
        bullet_list: { marginBottom: 10 },
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tw`flex-1 bg-[#020617]`}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={tw`flex-1 px-4`}>
                <View style={tw`flex-row items-center justify-between mb-2 mt-12 pb-4 border-b border-slate-800/50`}>
                    <View>
                        <Text style={tw`text-2xl font-bold text-white tracking-tight`}>SecureMate AI</Text>
                        <Text style={tw`text-emerald-500 text-[10px] font-bold tracking-widest uppercase mt-1`}>● Online Expert Assistant</Text>
                    </View>
                    <TouchableOpacity style={tw`bg-slate-800/50 p-2.5 rounded-2xl`}>
                        <MaterialCommunityIcons name="shield-check" size={22} color="#3b82f6" />
                    </TouchableOpacity>
                </View>

                <View style={tw`flex-1 relative`}>
                    {messages.length === 0 && (
                        <View style={tw`absolute inset-0 flex items-center justify-center opacity-10`}>
                            <Animated.View style={{
                                transform: [
                                    { translateX: vibrateAnim.interpolate({ inputRange: [-1, 1], outputRange: [-2, 2] }) },
                                    { translateY: vibrateAnim.interpolate({ inputRange: [-1, 1], outputRange: [2, -2] }) }
                                ]
                            }}>
                                <MaterialCommunityIcons name="robot" size={120} color="#3b82f6" />
                            </Animated.View>
                            <Text style={tw`text-[#3b82f6] text-xl font-bold tracking-tighter mt-4`}>SECUREMATE</Text>
                        </View>
                    )}
                    <ScrollView
                        ref={scrollViewRef}
                        style={tw`flex-1 mb-4`}
                        contentContainerStyle={tw`pb-6 pt-4`}
                        showsVerticalScrollIndicator={false}
                    >
                        {messages.map((m, i) => (
                            <View key={i} style={tw`flex-row ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
                                <View style={tw`flex-row items-start max-w-[88%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <View style={tw`bg-slate-800 rounded-xl p-2 mt-1 shadow-sm ${m.role === 'user' ? 'ml-3 bg-blue-600' : 'mr-3'}`}>
                                        <MaterialCommunityIcons
                                            name={m.role === 'user' ? "account" : "robot"}
                                            size={18}
                                            color="white"
                                        />
                                    </View>
                                    <View style={tw`p-4 rounded-2xl shadow-xl ${m.role === 'user'
                                        ? 'bg-blue-600 rounded-tr-none'
                                        : 'bg-slate-900 border border-slate-800 rounded-tl-none'
                                        }`}>
                                        {m.role === 'user' ? (
                                            <Text style={tw`text-white text-[13px] leading-relaxed font-medium`}>{m.content}</Text>
                                        ) : (
                                            <Markdown style={markdownStyles}>
                                                {m.content}
                                            </Markdown>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ))}
                        {isLoading && (
                            <View style={tw`flex-row justify-start mb-6 animate-in fade-in duration-300`}>
                                <View style={tw`flex-row items-center bg-slate-900/50 border border-slate-800 p-4 rounded-2xl rounded-tl-none`}>
                                    <View style={tw`flex-row gap-1 mr-3`}>
                                        <View style={tw`w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse`} />
                                        <View style={tw`w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse`} />
                                        <View style={tw`w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse`} />
                                    </View>
                                    <Text style={tw`text-slate-400 text-xs italic font-medium tracking-tight`}>AI is analyzing security patterns...</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={tw`flex-row items-center gap-3 pb-8`}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Ask about cybersecurity..."
                            placeholderTextColor="#475569"
                            style={[tw`flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm shadow-inner`, { maxHeight: 150 }]}
                            multiline
                        />
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!input.trim() || isLoading}
                            style={tw`bg-blue-600 p-4 rounded-2xl shadow-2xl ${(!input.trim() || isLoading) ? 'opacity-40' : 'active:scale-95 active:bg-blue-700'}`}
                        >
                            <MaterialCommunityIcons name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
