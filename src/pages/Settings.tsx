import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import * as Icons from 'lucide-react';
import api from '../lib/api';
import { jwtDecode } from 'jwt-decode';
import { useTheme } from '../hooks/useTheme';
import { isAxiosError } from 'axios';

interface UserToken {
    user: {
        id: string;
    }
}

export function Settings() {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        phone: '',
        avatar_url: ''
    });

    const [settings, setSettings] = useState({
        theme: theme,
        notifications: true,
        two_factor: false,
        auto_lock: '15 minutes',
        backups: true
    });

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode<UserToken>(token);
                    const user_id = decoded.user.id;

                    const [profileRes, settingsRes] = await Promise.all([
                        api.get(`/users/${user_id}/profile`).catch(() => ({ data: {} })),
                        api.get(`/users/${user_id}/settings`).catch(() => ({ data: {} }))
                    ]);

                    setProfile(prev => ({ ...prev, ...profileRes.data }));
                    setSettings(prev => ({ ...prev, ...settingsRes.data }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaveProfile = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode<UserToken>(token);
                await api.put(`/users/${decoded.user.id}/profile`, profile);
                setSaved(true);
                // Dispatch event to update Topbar
                window.dispatchEvent(new CustomEvent('profileUpdated'));
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            setUploadError('File size must be less than 2MB');
            setTimeout(() => setUploadError(''), 5000);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file (JPG, PNG, GIF)');
            setTimeout(() => setUploadError(''), 5000);
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        setUploadError('');
        setUploadSuccess(false);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated. Please log in again.');
            }

            const decoded = jwtDecode<UserToken>(token);
            const res = await api.post(`/users/${decoded.user.id}/avatar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProfile({ ...profile, avatar_url: res.data.avatar_url });
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);

            // Dispatch event to update Topbar
            window.dispatchEvent(new CustomEvent('profileUpdated'));
        } catch (err: unknown) {
            console.error('Upload failed', err);
            let errorMessage = 'Failed to upload photo. Please try again.';
            if (isAxiosError(err)) {
                errorMessage = err.response?.data?.msg || err.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setUploadError(errorMessage);
            setTimeout(() => setUploadError(''), 5000);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode<UserToken>(token);
                await api.put(`/users/${decoded.user.id}/settings`, settings);
                setTheme(settings.theme as 'dark' | 'light');
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-full overflow-x-hidden">
            <div className="space-y-0.5">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-sm text-muted-foreground">
                    Manage your SecureMate account preferences and security controls.
                </p>
            </div>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5 overflow-x-auto pb-2 lg:pb-0">
                    <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 min-w-max lg:min-w-0">
                        <Button
                            variant="ghost"
                            className={`justify-start text-xs md:text-sm ${activeTab === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <Icons.User className="mr-2 h-4 w-4" />
                            Profile
                        </Button>
                        <Button
                            variant="ghost"
                            className={`justify-start text-xs md:text-sm ${activeTab === 'security' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Icons.Shield className="mr-2 h-4 w-4" />
                            Security
                        </Button>
                        <Button
                            variant="ghost"
                            className={`justify-start text-xs md:text-sm ${activeTab === 'vault' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            onClick={() => setActiveTab('vault')}
                        >
                            <Icons.Lock className="mr-2 h-4 w-4" />
                            Vault
                        </Button>
                        <Button
                            variant="ghost"
                            className={`justify-start text-xs md:text-sm ${activeTab === 'preferences' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                            onClick={() => setActiveTab('preferences')}
                        >
                            <Icons.Monitor className="mr-2 h-4 w-4" />
                            System
                        </Button>
                    </nav>
                </aside>

                <div className="flex-1 lg:max-w-2xl bg-slate-900 rounded-xl border border-slate-800 p-4 md:p-6 min-h-[400px]">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Profile Settings</h3>
                                <p className="text-sm text-slate-400">
                                    Manage your personal information and profile preferences.
                                </p>
                            </div>

                            <div className="border-t border-slate-800 pt-4">
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 relative group">
                                            {profile.avatar_url ? (
                                                <img
                                                    src={profile.avatar_url.startsWith('http') ? profile.avatar_url : api.defaults.baseURL?.replace('/api', '') + profile.avatar_url}
                                                    alt="Avatar"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Icons.User className="h-12 w-12 text-slate-400" />
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Icons.Loader2 className="h-6 w-6 animate-spin text-white" />
                                                </div>
                                            )}
                                            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-slate-900"></span>
                                        </div>
                                        <div className="space-y-3 text-center sm:text-left">
                                            <h4 className="font-medium">Profile Picture</h4>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                                <label className="cursor-pointer">
                                                    <Input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleAvatarUpload}
                                                        disabled={uploading}
                                                    />
                                                    <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-800 bg-transparent hover:bg-slate-800 px-3 py-1 h-9">
                                                        {uploading ? 'Uploading...' : 'Upload New Photo'}
                                                    </span>
                                                </label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                    onClick={() => setProfile({ ...profile, avatar_url: '' })}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                            <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 2MB.</p>
                                            {uploadError && (
                                                <div className="text-red-500 text-xs mt-2 flex items-center">
                                                    <Icons.AlertCircle className="h-3 w-3 mr-1" />
                                                    {uploadError}
                                                </div>
                                            )}
                                            {uploadSuccess && (
                                                <div className="text-emerald-500 text-xs mt-2 flex items-center">
                                                    <Icons.CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Photo uploaded successfully!
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Full Name</label>
                                            <Input
                                                placeholder="Enter your name"
                                                value={profile.full_name}
                                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Email Address</label>
                                            <Input value={profile.email || 'user@example.com'} disabled />
                                            <p className="text-[0.8rem] text-slate-500 italic">Email cannot be changed.</p>
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Phone Number</label>
                                            <Input
                                                placeholder="+1 (555) 000-0000"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 items-center pt-2">
                                {saved && <span className="text-emerald-500 text-xs md:text-sm flex items-center"><Icons.CheckCircle2 className="mr-1 h-4 w-4" /> Saved successfully</span>}
                                <Button onClick={handleSaveProfile} disabled={saving}>
                                    {saving ? <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Security Controls</h3>
                                <p className="text-sm text-slate-400">
                                    Configure your account security and authentication methods.
                                </p>
                            </div>
                            <div className="border-t border-slate-800 pt-4 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h4 className="font-medium text-sm">Two-Factor Authentication</h4>
                                        <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                                    </div>
                                    <Button
                                        variant={settings.two_factor ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSettings({ ...settings, two_factor: !settings.two_factor })}
                                    >
                                        {settings.two_factor ? 'Enabled' : 'Enable'}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                                    <div className="space-y-0.5">
                                        <h4 className="font-medium text-sm">Session Management</h4>
                                        <p className="text-xs text-slate-500">View and manage your active login sessions.</p>
                                    </div>
                                    <Button variant="outline" size="sm" disabled>View Sessions</Button>
                                </div>
                                <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                                    <div className="space-y-0.5">
                                        <h4 className="font-medium text-sm">Change Password</h4>
                                        <p className="text-xs text-slate-500">Update your account password regularly.</p>
                                    </div>
                                    <Button variant="outline" size="sm" disabled>Update</Button>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 items-center pt-6">
                                {saved && <span className="text-emerald-500 text-sm flex items-center"><Icons.CheckCircle2 className="mr-1 h-4 w-4" /> Saved successfully</span>}
                                <Button onClick={handleSaveSettings} disabled={saving}>
                                    {saving ? <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Security
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'vault' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Vault Options</h3>
                                <p className="text-sm text-slate-400">
                                    Manage how your secure vault behaves and syncs.
                                </p>
                            </div>
                            <div className="border-t border-slate-800 pt-4 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h4 className="font-medium text-sm">Auto-lock Vault</h4>
                                        <p className="text-xs text-slate-500">Automatically lock the vault after inactivity.</p>
                                    </div>
                                    <select
                                        className="bg-slate-800 border-slate-700 rounded text-sm p-1.5 focus:border-primary-500"
                                        value={settings.auto_lock}
                                        onChange={(e) => setSettings({ ...settings, auto_lock: e.target.value })}
                                    >
                                        <option value="5 minutes">5 minutes</option>
                                        <option value="15 minutes">15 minutes</option>
                                        <option value="1 hour">1 hour</option>
                                        <option value="Never">Never</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h4 className="font-medium text-sm">Encrypted Backups</h4>
                                        <p className="text-xs text-slate-500">Keep a secure backup of your vault data.</p>
                                    </div>
                                    <Button
                                        variant={settings.backups ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSettings({ ...settings, backups: !settings.backups })}
                                    >
                                        {settings.backups ? 'Enabled' : 'Disabled'}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 items-center pt-6">
                                {saved && <span className="text-emerald-500 text-sm flex items-center"><Icons.CheckCircle2 className="mr-1 h-4 w-4" /> Saved successfully</span>}
                                <Button onClick={handleSaveSettings} disabled={saving}>
                                    {saving ? <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Vault
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">System Preferences</h3>
                                <p className="text-sm text-slate-400">
                                    Customize your SecureMate experience.
                                </p>
                            </div>
                            <div className="border-t border-slate-800 pt-4 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h4 className="font-medium text-sm">Appearance</h4>
                                        <p className="text-xs text-slate-500">Choose between dark and light themes.</p>
                                    </div>
                                    <div className="flex border border-slate-800 rounded-lg p-1 bg-slate-950">
                                        <Button
                                            variant={settings.theme === 'dark' ? 'default' : 'ghost'}
                                            size="sm"
                                            className="px-3"
                                            onClick={() => setSettings({ ...settings, theme: 'dark' })}
                                        >Dark</Button>
                                        <Button
                                            variant={settings.theme === 'light' ? 'default' : 'ghost'}
                                            size="sm"
                                            className="px-3"
                                            onClick={() => setSettings({ ...settings, theme: 'light' })}
                                        >Light</Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <h4 className="font-medium text-sm">Push Notifications</h4>
                                        <p className="text-xs text-slate-500">Receive alerts for important security events.</p>
                                    </div>
                                    <Button
                                        variant={settings.notifications ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                    >
                                        {settings.notifications ? 'Enabled' : 'Disabled'}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 items-center pt-6">
                                {saved && <span className="text-emerald-500 text-sm flex items-center"><Icons.CheckCircle2 className="mr-1 h-4 w-4" /> Saved successfully</span>}
                                <Button onClick={handleSaveSettings} disabled={saving}>
                                    {saving ? <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Preferences
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
