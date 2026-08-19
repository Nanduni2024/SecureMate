import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, TrendingUp, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useApi } from '../lib/api';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Scan {
    _id: string;
    url: string;
    risk_level: string;
    threat_score: number;
    created_at: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export function Dashboard() {
    const [scans, setScans] = useState<Scan[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanUrl, setScanUrl] = useState('');
    const [scanLoading, setScanLoading] = useState(false);
    const { user } = useAuth();
    const { addToast } = useToast();
    const api = useApi();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            try {
                const res = await api.get(`/scans/user/${user.id}`);
                setScans(res.data);
            } catch (err) {
                console.error(err);
                addToast('Failed to load scan history', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, api, addToast]);

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanUrl.trim()) {
            addToast('Please enter a URL to scan', 'warning');
            return;
        }

        setScanLoading(true);
        try {
            const res = await api.post('/scans', { user_id: user?.id, url: scanUrl });
            setScans(prev => [res.data, ...prev]);
            addToast('Scan completed successfully', 'success');
            navigate(`/reports/${res.data._id}`);
        } catch (err) {
            console.error(err);
            addToast('Scan failed. Please try again.', 'error');
        } finally {
            setScanLoading(false);
            setScanUrl('');
        }
    };

    const getSecurityColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const getSecurityStatus = (score: number) => {
        if (scans.length === 0) return { label: 'Analyzing', desc: 'Run your first scan to generate a security score.', icon: Search, color: 'text-primary-500', bg: 'border-primary-500' };
        if (score >= 80) return { label: 'Protected', desc: 'Your digital footprint is secure.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'border-emerald-500' };
        if (score >= 50) return { label: 'At Risk', desc: 'Some vulnerabilities detected.', icon: AlertTriangle, color: 'text-amber-500', bg: 'border-amber-500' };
        return { label: 'Danger', desc: 'Immediate action required!', icon: ShieldAlert, color: 'text-red-500', bg: 'border-red-500' };
    };

    const recentScans = scans.slice(0, 10);
    const avgThreat = recentScans.length > 0
        ? recentScans.reduce((acc, s) => acc + (s.threat_score || 0), 0) / recentScans.length
        : 0;
    const safetyScore = scans.length > 0 ? Math.max(0, Math.min(100, 100 - avgThreat)) : 100;
    const status = getSecurityStatus(safetyScore);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-slate-400 text-sm">Welcome back to your security command center.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-400">
                        Live Monitor Active
                    </Badge>
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-800 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                    <CardHeader>
                        <CardTitle className="text-xl">Scan a Link</CardTitle>
                        <CardDescription className="text-slate-300">Enter a suspicious URL to analyze it for phishing, malware, or other threats.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleScan} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    placeholder="https://example.com"
                                    className="pl-10 h-12 bg-slate-950/50 border-slate-700 text-lg"
                                    value={scanUrl}
                                    onChange={(e) => setScanUrl(e.target.value)}
                                    disabled={scanLoading}
                                />
                            </div>
                            <Button type="submit" size="lg" className="h-12 px-8" disabled={scanLoading || !scanUrl.trim()}>
                                {scanLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                                Analyze
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
                        <Activity className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{scans.length}</div>
                        <p className="text-xs text-slate-500">Security scans performed</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clean URLs</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{scans.filter(s => s.risk_level === 'safe').length}</div>
                        <p className="text-xs text-slate-500">No threats detected</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                        <TrendingUp className={cn("h-4 w-4", scans.length === 0 ? "text-slate-500" : getSecurityColor(safetyScore))} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", scans.length === 0 ? "text-slate-300" : getSecurityColor(safetyScore))}>
                            {scans.length === 0 ? '-' : `${Math.round(safetyScore)}%`}
                        </div>
                        <p className="text-xs text-slate-500">Based on recent activity</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Threats Found</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{scans.filter(s => s.risk_level === 'dangerous').length}</div>
                        <p className="text-xs text-slate-500">Dangerous URLs blocked</p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-slate-900 border-slate-800 flex flex-col">
                    <CardHeader>
                        <CardTitle>How to Use SecureMate</CardTitle>
                        <CardDescription>
                            Follow these steps to maximize your digital protection.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                <div className="flex items-center gap-2 text-primary-400">
                                    <div className="h-6 w-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-bold">1</div>
                                    <span className="font-semibold text-sm">Scan URLs</span>
                                </div>
                                <p className="text-xs text-slate-400">Use the scanner above to check suspicious links before you click them.</p>
                            </div>
                            <div className="space-y-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold">2</div>
                                    <span className="font-semibold text-sm">Learn Defense</span>
                                </div>
                                <p className="text-xs text-slate-400">Visit the Learning section to explore curated tutorials and security articles.</p>
                            </div>
                            <div className="space-y-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                <div className="flex items-center gap-2 text-amber-400">
                                    <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold">3</div>
                                    <span className="font-semibold text-sm">Manage Vault</span>
                                </div>
                                <p className="text-xs text-slate-400">Securely store your passwords and sensitive information in your private vault.</p>
                            </div>
                            <div className="space-y-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold">4</div>
                                    <span className="font-semibold text-sm">Review Reports</span>
                                </div>
                                <p className="text-xs text-slate-400">Check detailed intelligence reports from the Reports section.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-slate-900 border-slate-800 overflow-hidden">
                    <CardHeader>
                        <CardTitle>Device Health</CardTitle>
                        <CardDescription>Comprehensive security posture breakdown.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-6 py-2">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-center justify-center flex-1">
                                    <div className={cn(
                                        "relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-slate-800 transition-all duration-1000",
                                        scans.length > 0 ? "border-t-transparent" : ""
                                    )}>
                                        <div
                                            className={cn("absolute inset-0 rounded-full border-8 transition-all duration-1000", status.bg)}
                                            style={{ clipPath: `inset(0 ${100 - safetyScore}% 0 0)` }}
                                        ></div>
                                        <status.icon className={cn("h-12 w-12 transition-colors duration-500", status.color)} />
                                    </div>
                                    <div className="text-center mt-4">
                                        <h3 className={cn("text-2xl font-black uppercase tracking-tighter", status.color)}>{status.label}</h3>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                            {scans.length > 0 ? `${Math.round(safetyScore)}% Safety Score` : 'Pending Data'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-4 flex-1 pl-6 border-l border-slate-800">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase">
                                            <span className="text-emerald-500">Safe</span>
                                            <span className="text-slate-400">{scans.filter(s => s.risk_level === 'safe').length}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full" style={{ width: `${(scans.filter(s => s.risk_level === 'safe').length / (scans.length || 1)) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase">
                                            <span className="text-amber-500">Warnings</span>
                                            <span className="text-slate-400">{scans.filter(s => s.risk_level === 'warning').length}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-amber-500 h-full" style={{ width: `${(scans.filter(s => s.risk_level === 'warning').length / (scans.length || 1)) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase">
                                            <span className="text-red-500">Threats</span>
                                            <span className="text-slate-400">{scans.filter(s => s.risk_level === 'dangerous').length}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-red-500 h-full" style={{ width: `${(scans.filter(s => s.risk_level === 'dangerous').length / (scans.length || 1)) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 italic text-center border-t border-slate-800/50 pt-4">
                                {status.desc} {scans.length > 0 && "Regular scanning improves your overall safety score."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Card className="bg-slate-900 border-slate-800 mt-6">
                    <CardHeader>
                        <CardTitle>Recent Scan Intelligence</CardTitle>
                        <CardDescription>
                            Real-time analysis of your digital interactions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {scans.slice(0, 5).map((item, index) => (
                                <div key={index} className="flex items-center justify-between border-b border-slate-800/50 pb-3 last:border-0 last:pb-0 group">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm truncate max-w-[200px] md:max-w-[350px] group-hover:text-primary-400 transition-colors">{item.url}</span>
                                        <span className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">{new Date(item.created_at).toLocaleString()}</span>
                                    </div>
                                    <Badge
                                        variant={item.risk_level === 'dangerous' ? 'destructive' : item.risk_level === 'warning' ? 'secondary' : 'default'}
                                        className={cn(
                                            "capitalize",
                                            item.risk_level === 'safe' && "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                        )}
                                    >
                                        {item.risk_level}
                                    </Badge>
                                </div>
                            ))}
                            {scans.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                                    <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center">
                                        <Search className="h-6 w-6 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-300">No scans yet</p>
                                        <p className="text-xs text-slate-500 mt-1">Use the scanner above to check your first URL.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
