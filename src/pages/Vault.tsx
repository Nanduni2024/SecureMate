import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, Plus, Search, Trash2, Key, FileText, ExternalLink, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import { jwtDecode } from 'jwt-decode';

interface VaultItem {
    _id: string;
    type: 'password' | 'note';
    title: string;
    username?: string;
    password?: string;
    url?: string;
    note?: string;
    created_at: string;
}

interface UserToken {
    user: {
        id: string;
    }
}

export function Vault() {
    const [items, setItems] = useState<VaultItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'password' | 'note'>('all');
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode<UserToken>(token);
                    const user_id = decoded.user.id;
                    const res = await api.get(`/vault/user/${user_id}`);
                    setItems(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const togglePassword = (id: string) => {
        setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const deleteItem = async (id: string) => {
        try {
            await api.delete(`/vault/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState<Partial<VaultItem>>({
        type: 'password',
        title: '',
        username: '',
        password: '',
        url: '',
        note: ''
    });

    const addItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode<UserToken>(token);
                const res = await api.post('/vault', { ...newItem, user_id: decoded.user.id });
                setItems([res.data, ...items]);
                setShowAddModal(false);
                setNewItem({ type: 'password', title: '', username: '', password: '', url: '', note: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredItems = activeTab === 'all'
        ? items
        : items.filter(item => item.type === activeTab);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-0.5">
                    <h2 className="text-3xl font-bold tracking-tight">Security Vault</h2>
                    <p className="text-muted-foreground">
                        Securely store and manage your sensitive information.
                    </p>
                </div>
                <Button className="bg-primary-600 hover:bg-primary-700" onClick={() => setShowAddModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Item
                </Button>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle>Add Vault Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={addItem} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <select
                                        className="w-full bg-slate-800 border-slate-700 rounded-md p-2 text-sm"
                                        value={newItem.type}
                                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'password' | 'note' })}
                                    >
                                        <option value="password">Password</option>
                                        <option value="note">Secure Note</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                        placeholder="e.g. My Gmail"
                                        value={newItem.title}
                                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                        required
                                    />
                                </div>

                                {newItem.type === 'password' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Username</label>
                                            <Input
                                                placeholder="Username or email"
                                                value={newItem.username}
                                                onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <Input
                                                type="password"
                                                value={newItem.password}
                                                onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Website URL</label>
                                            <Input
                                                placeholder="https://..."
                                                value={newItem.url}
                                                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}


                                {newItem.type === 'note' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Note Content</label>
                                        <textarea
                                            className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-primary-500"
                                            placeholder="Write your secret here..."
                                            value={newItem.note}
                                            onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                                    <Button type="submit">Save Vault Item</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <Button
                        variant={activeTab === 'all' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('all')}
                        className={activeTab === 'all' ? '' : 'text-slate-400'}
                    >
                        All
                    </Button>
                    <Button
                        variant={activeTab === 'password' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('password')}
                        className={activeTab === 'password' ? '' : 'text-slate-400'}
                    >
                        Passwords
                    </Button>
                    <Button
                        variant={activeTab === 'note' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('note')}
                        className={activeTab === 'note' ? '' : 'text-slate-400'}
                    >
                        Notes
                    </Button>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input placeholder="Search vault..." className="pl-9" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                    <Card key={item._id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-slate-800 rounded-lg">
                                    {item.type === 'password' && <Key className="h-4 w-4 text-amber-500" />}
                                    {item.type === 'note' && <FileText className="h-4 w-4 text-blue-500" />}
                                </div>
                                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => deleteItem(item._id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {item.type === 'password' && (
                                    <>
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-500">Username / Email</p>
                                            <p className="text-sm font-medium">{item.username}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-500">Password</p>
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-medium">
                                                    {showPassword[item._id] ? item.password : '••••••••••••'}
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => togglePassword(item._id)}
                                                >
                                                    {showPassword[item._id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                                </Button>
                                            </div>
                                        </div>
                                        {item.url && (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center text-xs text-primary-500 hover:underline pt-2"
                                            >
                                                <ExternalLink className="mr-1 h-3 w-3" />
                                                Go to Website
                                            </a>
                                        )}
                                    </>
                                )}
                                {item.type === 'note' && (
                                    <p className="text-sm text-slate-400 line-clamp-3 italic">
                                        "{item.note}"
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredItems.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                        <Lock className="mx-auto h-12 w-12 text-slate-700 mb-4" />
                        <h3 className="text-lg font-medium text-slate-400">Your vault is empty</h3>
                        <p className="text-sm text-slate-500 mb-6">Start adding your passwords and secure notes here.</p>
                        <Button variant="outline" onClick={() => setShowAddModal(true)}>Add Your First Item</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
