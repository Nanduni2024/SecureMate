import { PlayCircle, Info, ArrowRight, Activity, Vault, BookOpen, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Link } from 'react-router-dom';

export function LiveDemo() {
    const handleGoDashboard = () => {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/register';
        }
    };

    return (
        <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-3">
                    <PlayCircle className="h-8 w-8 text-primary-500" />
                    Interactive Live Demo
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Welcome to SecureMate! Watch this quick guide to learn how to protect your digital life using our professional security command center.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="aspect-video relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/z5nc9MDbvkw?autoplay=1&mute=1&rel=0&modestbranding=1"
                        title="SecureMate Live Demo"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p className="text-sm text-slate-300 italic">"SecureMate: Your first line of defense against modern threats."</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-slate-900 border-slate-800 hover:border-primary-500/30 transition-all">
                    <CardHeader className="pb-2">
                        <Search className="h-5 w-5 text-primary-400 mb-2" />
                        <CardTitle className="text-base">URL Scanner</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Paste any link in the search bar. Our AI analyzes the URL for phishing, malware, and deceptive patterns in real-time.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/30 transition-all">
                    <CardHeader className="pb-2">
                        <Activity className="h-5 w-5 text-emerald-400 mb-2" />
                        <CardTitle className="text-base">Device Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Monitor your overall security posture. Your safety score dynamically updates based on your recent scan history and activity.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 hover:border-amber-500/30 transition-all">
                    <CardHeader className="pb-2">
                        <Vault className="h-5 w-5 text-amber-400 mb-2" />
                        <CardTitle className="text-base">Secure Vault</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Store your passwords and sensitive codes using military-grade encryption. Access them safely across all your devices.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/30 transition-all">
                    <CardHeader className="pb-2">
                        <BookOpen className="h-5 w-5 text-blue-400 mb-2" />
                        <CardTitle className="text-base">Learning Hub</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Stay educated with our Awareness Learning section. Watch tutorials and read articles updated daily by security experts.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col items-center space-y-4 pt-4">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-sm text-slate-300">
                    <Info className="h-4 w-4 text-primary-400" />
                    Ready to start protecting your data?
                </div>
                <div className="flex gap-4">
                    <Button className="px-8" onClick={handleGoDashboard}>
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Link to="/">
                        <Button variant="outline">
                            Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
