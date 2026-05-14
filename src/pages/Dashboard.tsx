import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import api from '../lib/api';
import { jwtDecode } from 'jwt-decode';
import { cn } from '../lib/utils';

interface Scan {
    _id: string;
    url: string;
    risk_level: string;
    threat_score: number;
    created_at: string;
}

interface UserToken {
    user: {
        id: string;
    }
}

export function Dashboard() {
    const [scans, setScans] = useState<Scan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode<UserToken>(token);
                    const user_id = decoded.user.id;
                    const res = await api.get(`/scans/user/${user_id}`);
                    setScans(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getSecurityColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const getSecurityStatus = (score: number) => {
        if (score >= 80) return { label: 'Protected', desc: 'Your digital footprint is secure.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'border-emerald-500' };
        if (score >= 50) return { label: 'At Risk', desc: 'Some vulnerabilities detected.', icon: AlertTriangle, color: 'text-amber-500', bg: 'border-amber-500' };
        return { label: 'Danger', desc: 'Immediate action required!', icon: ShieldAlert, color: 'text-red-500', bg: 'border-red-500' };
    };

    // Calculate score: 100 - (average threat score of last 10 scans)
    const recentScans = scans.slice(0, 10);
    const avgThreat = recentScans.length > 0
        ? recentScans.reduce((acc, s) => acc + (s.threat_score || 0), 0) / recentScans.length
        : 0;
    const safetyScore = Math.max(0, Math.min(100, 100 - avgThreat));
    const status = getSecurityStatus(safetyScore);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-slate-400 text-sm">Welcome back to your security command center.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-slate-900 border-slate-800 text-slate-400">
                        Live Monitor Active
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
                        <Activity className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{scans.length}</div>
                        <p className="text-xs text-slate-500">Security scans performed</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clean URLs</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{scans.filter(s => s.risk_level === 'safe').length}</div>
                        <p className="text-xs text-slate-500">No threats detected</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                        <TrendingUp className={cn("h-4 w-4", getSecurityColor(safetyScore))} />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", getSecurityColor(safetyScore))}>{Math.round(safetyScore)}%</div>
                        <p className="text-xs text-slate-500">Based on recent activity</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Threats Found</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{scans.filter(s => s.risk_level === 'dangerous').length}</div>
                        <p className="text-xs text-slate-500">Dangerous URLs blocked</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
                                <p className="text-xs text-slate-400">Paste any suspicious link into the search bar at the top to check for threats.</p>
                            </div>
                            <div className="space-y-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold">2</div>
                                    <span className="font-semibold text-sm">Learn Defense</span>
                                </div>
                                <p className="text-xs text-slate-400">Visit the Awareness Hub to watch curated tutorials and read security articles.</p>
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
                                <p className="text-xs text-slate-400">Download comprehensive security reports from the Scan History section.</p>
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
                                        safetyScore > 0 ? "border-t-transparent" : ""
                                    )}>
                                        <div
                                            className={cn("absolute inset-0 rounded-full border-8 transition-all duration-1000", status.bg)}
                                            style={{ clipPath: `inset(0 ${100 - safetyScore}% 0 0)` }}
                                        ></div>
                                        <status.icon className={cn("h-12 w-12 transition-colors duration-500", status.color)} />
                                    </div>
                                    <div className="text-center mt-4">
                                        <h3 className={cn("text-2xl font-black uppercase tracking-tighter", status.color)}>{status.label}</h3>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{Math.round(safetyScore)}% Safety Score</p>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-4 flex-1 pl-6 border-l border-slate-800">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-bold uppercase">
                                            <span className="text-emerald-500">Safe Scans</span>
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
                                {status.desc} Regular scanning improves your overall safety score.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
                        {scans.length === 0 && <div className="text-sm text-slate-500 py-10 text-center">No scans found. Start scanning to see activity here.</div>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
