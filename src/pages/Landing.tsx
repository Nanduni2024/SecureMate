import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Shield, Check, ArrowRight } from 'lucide-react';
import Logo from '../assets/Logo.png';

export function Landing() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            <header className="px-6 h-16 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur fixed w-full z-50">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="SecureMate Logo" className="h-8 w-8" />
                    <span className="font-bold text-xl">SecureMate</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 pt-16">
                <section className="relative py-20 lg:py-32 overflow-hidden px-6">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[120px] -z-10"></div>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent pb-2">
                            AI-Powered Personal <br /> Cyber Guard
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Protect your digital life with real-time threat detection, dark web monitoring, and AI-driven security analysis. All in one professional dashboard.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="h-12 px-8 text-lg">
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/demo">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                    Live Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-slate-900/30 px-6">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-primary-900/30 rounded-lg flex items-center justify-center border border-primary-500/20">
                                <Shield className="h-6 w-6 text-primary-400" />
                            </div>
                            <h3 className="text-xl font-bold">Real-time Protection</h3>
                            <p className="text-slate-400">Instantly blocks malicious URLs and phishing attempts using advanced machine learning.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-emerald-900/30 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                <Check className="h-6 w-6 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold">Smart Reports</h3>
                            <p className="text-slate-400">Get detailed insights into threats with actionable recommendations to stay safe.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-12 bg-amber-900/30 rounded-lg flex items-center justify-center border border-amber-500/20">
                                <Shield className="h-6 w-6 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold">Privacy First</h3>
                            <p className="text-slate-400">Your data is encrypted and never sold. We prioritize your privacy above all else.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                &copy; 2025 SecureMate. Built for safety.
            </footer>
        </div>
    );
}
