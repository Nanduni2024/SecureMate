import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Shield, ShieldCheck, ShieldAlert, ArrowRight, Zap, Lock, Brain, BarChart3, Smartphone, Globe } from 'lucide-react';
import Logo from '../assets/Logo.png';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Zap,
        color: 'text-primary-400',
        bg: 'bg-primary-900/30 border-primary-500/20',
        title: 'Real-time URL Scanning',
        desc: 'Instantly analyze any suspicious link using VirusTotal\'s 70+ security engines — before you click.',
    },
    {
        icon: Lock,
        color: 'text-amber-400',
        bg: 'bg-amber-900/30 border-amber-500/20',
        title: 'Encrypted Cyber Vault',
        desc: 'Store passwords and secure notes with AES-256 encryption. Your secrets, truly secret.',
    },
    {
        icon: Brain,
        color: 'text-emerald-400',
        bg: 'bg-emerald-900/30 border-emerald-500/20',
        title: 'AI Security Assistant',
        desc: 'Chat with a Gemini-powered AI that explains threats, teaches best practices, and guides you to safety.',
    },
    {
        icon: BarChart3,
        color: 'text-blue-400',
        bg: 'bg-blue-900/30 border-blue-500/20',
        title: 'Smart Security Reports',
        desc: 'Download PDF & CSV reports of your scan history with full threat intelligence breakdowns.',
    },
    {
        icon: Smartphone,
        color: 'text-violet-400',
        bg: 'bg-violet-900/30 border-violet-500/20',
        title: 'Cross-Platform Mobile App',
        desc: 'Full-featured React Native mobile app — stay protected whether you\'re on desktop or on the go.',
    },
    {
        icon: Globe,
        color: 'text-rose-400',
        bg: 'bg-rose-900/30 border-rose-500/20',
        title: 'Security Awareness Hub',
        desc: 'AI-curated cybersecurity learning content to keep you educated against the latest threats.',
    },
];

const stats = [
    { value: '70+', label: 'Threat Engines' },
    { value: 'AES-256', label: 'Vault Encryption' },
    { value: '100%', label: 'Privacy First' },
    { value: 'Real-time', label: 'Threat Analysis' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } }
};

export function Landing() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            {/* Navbar */}
            <header className="px-6 h-16 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md fixed w-full z-50">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="SecureMate Logo" className="h-8 w-8" />
                    <span className="font-bold text-xl tracking-tight">SecureMate</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#stats" className="hover:text-white transition-colors">Why SecureMate</a>
                    <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
                </nav>
                <div className="flex items-center gap-3">
                    <Link to="/login">
                        <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link to="/register">
                        <Button size="sm">Get Started Free</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 pt-16">

                {/* Hero Section */}
                <section className="relative py-24 lg:py-36 overflow-hidden px-6">
                    {/* Subtle radial glow in the background */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="w-[600px] h-[600px] rounded-full bg-primary-600/10 blur-[120px]" />
                    </div>

                    <motion.div
                        className="max-w-5xl mx-auto text-center space-y-8 relative z-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div variants={itemVariants}>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
                                <ShieldCheck className="h-4 w-4" />
                                AI-Powered Cybersecurity Platform
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-50 pb-2 leading-tight"
                        >
                            Your Personal <br />
                            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                                Cyber Guardian
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            Protect your digital life with real-time URL threat detection, an encrypted password vault, 
                            and an AI security assistant — all in one professional platform.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/demo" id="demo">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto border-slate-700 hover:border-primary-500">
                                    <Shield className="mr-2 h-5 w-5" />
                                    Live Demo
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Threat Level Preview */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap items-center justify-center gap-3 pt-4"
                        >
                            {['Safe', 'Warning', 'Dangerous'].map((level) => (
                                <div
                                    key={level}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                                        level === 'Safe'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            : level === 'Warning'
                                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}
                                >
                                    {level === 'Safe' ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                                    {level}
                                </div>
                            ))}
                            <span className="text-xs text-slate-500">Real-time threat classification</span>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Stats Section */}
                <section id="stats" className="py-16 border-y border-slate-800 bg-slate-900/40 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-3xl font-black text-primary-400 mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight">Everything You Need to Stay Safe</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                A complete security platform built for individuals who take their digital privacy seriously.
                            </p>
                        </div>

                        <motion.div
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            {features.map((feature) => (
                                <motion.div
                                    key={feature.title}
                                    variants={itemVariants}
                                    className="group p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900 transition-all duration-200"
                                >
                                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center border mb-4 ${feature.bg}`}>
                                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-400 transition-colors">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-4">
                            <Shield className="h-8 w-8 text-primary-400" />
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight">Start Protecting Yourself Today</h2>
                        <p className="text-slate-400 text-lg">
                            Join SecureMate and get instant access to real-time threat detection, 
                            encrypted vault storage, and AI-powered cybersecurity guidance — completely free.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="h-12 px-10 text-base w-full sm:w-auto">
                                    Create Free Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="h-12 px-10 text-base w-full sm:w-auto border-slate-700">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <img src={Logo} alt="SecureMate" className="h-5 w-5 opacity-60" />
                    <span className="font-semibold text-slate-400">SecureMate</span>
                </div>
                <p>&copy; {new Date().getFullYear()} SecureMate. Built for safety. Powered by AI.</p>
            </footer>
        </div>
    );
}
