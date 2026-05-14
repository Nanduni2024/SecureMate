import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
    Lock, Plus, Search, Trash2, Key, CreditCard,
    FileText, Eye, EyeOff, X
} from 'lucide-react-native';
import api from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { decodeJwt } from '../../utils/jwt';

interface VaultItem {
    _id: string;
    type: 'password' | 'card' | 'note';
    title: string;
    username?: string;
    password?: string;
    url?: string;
    note?: string;
    card_number?: string;
    expiry?: string;
    cvv?: string;
    created_at: string;
}

export default function VaultScreen() {
    const { token } = useAuth();
    const [items, setItems] = useState<VaultItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'password' | 'card' | 'note'>('all');
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newItem, setNewItem] = useState<Partial<VaultItem>>({
        type: 'password',
        title: '',
        username: '',
        password: '',
        url: '',
        note: '',
        card_number: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        const fetchItems = async () => {
            if (!token) return;
            try {
                const decoded = decodeJwt(token);
                if (decoded) {
                    const user_id = decoded.user?.id || decoded.id;
                    const res = await api.get(`vault/user/${user_id}`);
                    setItems(res.data);
                }
            } catch (err) {
                console.error('[Vault] Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [token]);

    const togglePassword = (id: string) => {
        setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const deleteItem = async (id: string) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to remove this item from your vault?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`vault/${id}`);
                            setItems(items.filter(item => item._id !== id));
                        } catch (err) {
                            console.error('[Vault] Delete Error:', err);
                        }
                    }
                }
            ]
        );
    };

    const addItem = async () => {
        if (!newItem.title) {
            Alert.alert('Error', 'Please provide a title');
            return;
        }

        try {
            const decoded = decodeJwt(token!);
            const user_id = decoded.user?.id || decoded.id;
            const res = await api.post('/vault', { ...newItem, user_id });
            setItems([res.data, ...items]);
            setShowAddModal(false);
            setNewItem({ type: 'password', title: '', username: '', password: '', url: '', note: '', card_number: '', expiry: '', cvv: '' });
        } catch (err) {
            console.error('[Vault] Add Error:', err);
            Alert.alert('Error', 'Failed to save item');
        }
    };

    const filteredItems = items
        .filter(item => activeTab === 'all' || item.type === activeTab)
        .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) {
        return (
            <View style={tw`flex-1 bg-slate-950 items-center justify-center`}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-slate-950 pt-12`}>
            {/* Header */}
            <View style={tw`px-6 mb-6 flex-row items-center justify-between`}>
                <View>
                    <Text style={tw`text-2xl font-bold text-white`}>Security Vault</Text>
                    <Text style={tw`text-slate-400 text-sm`}>Manage your sensitive data</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setShowAddModal(true)}
                    style={tw`h-10 w-10 bg-blue-500 items-center justify-center rounded-full`}
                >
                    <Plus color="white" size={24} />
                </TouchableOpacity>
            </View>

            {/* Tabs & Search */}
            <View style={tw`px-6 mb-4`}>
                <View style={tw`flex-row bg-slate-900 p-1 rounded-lg border border-slate-800 mb-4`}>
                    {['all', 'password', 'card', 'note'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab as 'all' | 'password' | 'card' | 'note')}
                            style={tw`flex-1 items-center py-2 rounded-md ${activeTab === tab ? 'bg-blue-600' : ''}`}
                        >
                            <Text style={tw`text-xs font-semibold ${activeTab === tab ? 'text-white' : 'text-slate-400'} capitalize`}>
                                {tab === 'all' ? 'All' : tab + 's'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={tw`relative`}>
                    <View style={tw`absolute left-3 top-3 z-10`}>
                        <Search size={18} color="#94a3b8" />
                    </View>
                    <Input
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search your vault..."
                        style={tw`pl-10 h-10 bg-slate-900 border-slate-800 text-white rounded-lg`}
                    />
                </View>
            </View>

            {/* Items List */}
            <ScrollView style={tw`flex-1 px-6`}>
                {filteredItems.map((item) => (
                    <View key={item._id} style={tw`bg-slate-900 border border-slate-800 rounded-xl mb-4 overflow-hidden`}>
                        <View style={tw`p-4 flex-row items-center justify-between`}>
                            <View style={tw`flex-row items-center`}>
                                <View style={tw`p-2 bg-slate-800 rounded-lg mr-3`}>
                                    {item.type === 'password' && <Key size={18} color="#f59e0b" />}
                                    {item.type === 'card' && <CreditCard size={18} color="#10b981" />}
                                    {item.type === 'note' && <FileText size={18} color="#3b82f6" />}
                                </View>
                                <View>
                                    <Text style={tw`text-white font-semibold`}>{item.title}</Text>
                                    <Text style={tw`text-slate-500 text-xs capitalize`}>{item.type}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => deleteItem(item._id)}>
                                <Trash2 size={18} color="#ef4444" />
                            </TouchableOpacity>
                        </View>

                        <View style={tw`px-4 pb-4 border-t border-slate-800 pt-3`}>
                            {item.type === 'password' && (
                                <View style={tw`gap-2`}>
                                    <View>
                                        <Text style={tw`text-slate-500 text-[10px] uppercase font-bold tracking-wider`}>Username</Text>
                                        <Text style={tw`text-slate-200 text-sm`}>{item.username || 'N/A'}</Text>
                                    </View>
                                    <View>
                                        <Text style={tw`text-slate-500 text-[10px] uppercase font-bold tracking-wider`}>Password</Text>
                                        <View style={tw`flex-row items-center justify-between`}>
                                            <Text style={tw`text-slate-200 text-sm font-mono`}>
                                                {showPassword[item._id] ? (item.password || '') : '••••••••••••'}
                                            </Text>
                                            <TouchableOpacity onPress={() => togglePassword(item._id)}>
                                                {showPassword[item._id] ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {item.type === 'card' && (
                                <View style={tw`gap-2`}>
                                    <View>
                                        <Text style={tw`text-slate-500 text-[10px] uppercase font-bold tracking-wider`}>Card Number</Text>
                                        <View style={tw`flex-row items-center justify-between`}>
                                            <Text style={tw`text-slate-200 text-sm tracking-widest`}>
                                                {showPassword[item._id] ? (item.card_number || '') : `•••• •••• •••• ${item.card_number?.slice(-4) || '****'}`}
                                            </Text>
                                            <TouchableOpacity onPress={() => togglePassword(item._id)}>
                                                {showPassword[item._id] ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={tw`flex-row gap-4`}>
                                        <View>
                                            <Text style={tw`text-slate-500 text-[10px] uppercase font-bold tracking-wider`}>Expiry</Text>
                                            <Text style={tw`text-slate-200 text-sm`}>{item.expiry || ''}</Text>
                                        </View>
                                        <View>
                                            <Text style={tw`text-slate-500 text-[10px] uppercase font-bold tracking-wider`}>CVV</Text>
                                            <Text style={tw`text-slate-200 text-sm`}>***</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {item.type === 'note' && (
                                <Text style={tw`text-slate-400 text-sm italic`}>{`"${item.note || ''}"`}</Text>
                            )}
                        </View>
                    </View>
                ))}

                {filteredItems.length === 0 && (
                    <View style={tw`py-12 items-center bg-slate-900 border border-dashed border-slate-800 rounded-xl`}>
                        <Lock size={48} color="#1e293b" style={tw`mb-4`} />
                        <Text style={tw`text-slate-400 font-medium`}>Vault is empty</Text>
                        <Text style={tw`text-slate-500 text-sm text-center px-6 mt-2 mb-6`}>
                            Start adding your passwords and secure notes.
                        </Text>
                        <Button title="Add Your First Item" onPress={() => setShowAddModal(true)} />
                    </View>
                )}
                <View style={tw`h-20`} />
            </ScrollView>

            {/* Add Item Modal */}
            <Modal
                visible={showAddModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={tw`flex-1 justify-end bg-black/60`}>
                    <View style={tw`bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 h-[80%]`}>
                        <View style={tw`flex-row justify-between items-center mb-6`}>
                            <Text style={tw`text-xl font-bold text-white`}>Add Vault Item</Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <X color="#94a3b8" size={24} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={tw`gap-4 mb-8`}>
                                <View>
                                    <Text style={tw`text-slate-400 text-xs mb-2 uppercase font-bold`}>Type</Text>
                                    <View style={tw`flex-row gap-2`}>
                                        {['password', 'card', 'note'].map((type) => (
                                            <TouchableOpacity
                                                key={type}
                                                onPress={() => setNewItem({ ...newItem, type: type as 'password' | 'card' | 'note' })}
                                                style={tw`flex-1 py-2 items-center border rounded-lg ${newItem.type === type ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'}`}
                                            >
                                                <Text style={tw`text-xs capitalize font-semibold ${newItem.type === type ? 'text-white' : 'text-slate-400'}`}>
                                                    {type}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <Input
                                    label="Title"
                                    placeholder="e.g. My Gmail"
                                    value={newItem.title}
                                    onChangeText={(text) => setNewItem({ ...newItem, title: text })}
                                />

                                {newItem.type === 'password' && (
                                    <>
                                        <Input
                                            label="Username"
                                            placeholder="Username or email"
                                            value={newItem.username}
                                            onChangeText={(text) => setNewItem({ ...newItem, username: text })}
                                        />
                                        <Input
                                            label="Password"
                                            placeholder="••••••••"
                                            secureTextEntry
                                            value={newItem.password}
                                            onChangeText={(text) => setNewItem({ ...newItem, password: text })}
                                        />
                                        <Input
                                            label="Website URL"
                                            placeholder="https://..."
                                            value={newItem.url}
                                            onChangeText={(text) => setNewItem({ ...newItem, url: text })}
                                        />
                                    </>
                                )}

                                {newItem.type === 'card' && (
                                    <>
                                        <Input
                                            label="Card Number"
                                            placeholder="0000 0000 0000 0000"
                                            keyboardType="numeric"
                                            value={newItem.card_number}
                                            onChangeText={(text) => setNewItem({ ...newItem, card_number: text })}
                                        />
                                        <View style={tw`flex-row gap-4`}>
                                            <View style={tw`flex-1`}>
                                                <Input
                                                    label="Expiry"
                                                    placeholder="MM/YY"
                                                    value={newItem.expiry}
                                                    onChangeText={(text) => setNewItem({ ...newItem, expiry: text })}
                                                />
                                            </View>
                                            <View style={tw`flex-1`}>
                                                <Input
                                                    label="CVV"
                                                    placeholder="123"
                                                    keyboardType="numeric"
                                                    value={newItem.cvv}
                                                    onChangeText={(text) => setNewItem({ ...newItem, cvv: text })}
                                                />
                                            </View>
                                        </View>
                                    </>
                                )}

                                {newItem.type === 'note' && (
                                    <View>
                                        <Text style={tw`text-slate-400 text-sm mb-2`}>Note Content</Text>
                                        <Input
                                            placeholder="Write your secret here..."
                                            multiline
                                            style={tw`min-h-[100px] text-top`}
                                            value={newItem.note}
                                            onChangeText={(text) => setNewItem({ ...newItem, note: text })}
                                        />
                                    </View>
                                )}
                            </View>

                            <Button title="Save Vault Item" onPress={addItem} />
                            <View style={tw`h-10`} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
