import { Search, Bell, User, Loader2, Menu, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { cn } from '../lib/utils';

interface UserToken {
    user: {
        id: string;
    }
}

interface Notification {
    id: number;
    text: string;
    date: string;
    read: boolean;
}

interface TopbarProps {
    toggleSidebar: () => void;
}

export function Topbar({ toggleSidebar }: TopbarProps) {
    const [scanUrl, setScanUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode<UserToken>(token);
                    const user_id = decoded.user.id;

                    const [notifRes, profileRes] = await Promise.all([
                        api.get(`/users/${user_id}/notifications`),
                        api.get(`/users/${user_id}/profile`)
                    ]);

                    setNotifications(notifRes.data);
                    if (profileRes.data.avatar_url) {
                        setAvatarUrl(profileRes.data.avatar_url);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch user data', err);
            }
        };

        fetchUserData();

        // Listen for profile updates
        window.addEventListener('profileUpdated', fetchUserData);
        return () => window.removeEventListener('profileUpdated', fetchUserData);
    }, []);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanUrl) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode<UserToken>(token);
                const user_id = decoded.user.id;
                const res = await api.post('/scans', { user_id, url: scanUrl });
                navigate(`/reports/${res.data._id}`);
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setScanUrl('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 md:px-6 backdrop-blur">
            <div className="flex items-center gap-4 flex-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={toggleSidebar}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="flex-1 flex items-center gap-4">
                    <form onSubmit={handleScan} className="hidden md:flex relative group max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Scan URL, File or IP Address..."
                            className="pl-10 bg-slate-900 border-slate-800 focus:border-primary-500/50 transition-all placeholder:text-slate-600"
                            value={scanUrl}
                            onChange={(e) => setScanUrl(e.target.value)}
                            disabled={loading}
                        />
                        {scanUrl && (
                            <div className="absolute right-1 top-1 bottom-1">
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="h-full px-3"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Scan'}
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Notifications */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative"
                    >
                        <Bell className="h-5 w-5 text-slate-400" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-500" />
                        )}
                    </Button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-800 bg-slate-900 p-2 shadow-xl z-50">
                            <h3 className="px-3 py-2 text-sm font-semibold border-b border-slate-800">Notifications</h3>
                            <div className="max-h-60 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(n => (
                                        <div key={n.id} className={cn("p-3 text-xs border-b border-slate-800/50 last:border-0", !n.read && "bg-primary-500/5")}>
                                            <p className="font-medium text-slate-200">{n.text}</p>
                                            <p className="text-slate-500 mt-1">{new Date(n.date).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-4 text-center text-slate-500 text-sm">No notifications</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 hover:border-primary-500 transition-colors"
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl.startsWith('http') ? avatarUrl : `http://localhost:5000${avatarUrl}`}
                                alt="User"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User className="h-5 w-5 text-slate-400 group-hover:text-primary-400 transition-colors" />
                        )}
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-800 bg-slate-900 py-1 shadow-xl z-50">
                            <Link
                                to="/settings"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <SettingsIcon className="h-4 w-4" />
                                Settings
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
