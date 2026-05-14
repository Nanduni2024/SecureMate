$content = @'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Shield, BookOpen, ChevronRight, Video, Lock, Fingerprint, Activity, Clock, ExternalLink } from 'lucide-react';

const videos = [
    {
        id: "v1",
        title: "Cyber Security For Beginners 2024",
        description: "A complete guide to understanding the modern threat landscape, common attack vectors, and basic defense strategies.",
        summary: "This comprehensive tutorial covers the core pillars of cybersecurity. You will learn about the CIA triad (Confidentiality, Integrity, Availability), various types of malware like ransomware and trojans, and the importance of multi-layered security. Perfect for absolute beginners looking to build a strong foundation.",
        duration: "12:15",
        youtubeId: "z5nc9MDbvkw",
        category: "Foundations",
        icon: Shield
    },
    {
        id: "v2",
        title: "How to Spot Phishing Scams",
        description: "Learn to identify sophisticated social engineering tactics and protect your personal information from hackers.",
        summary: "Phishing remains the #1 entry point for cyber attacks. This video breaks down real-world examples of deceptive emails and SMS messages. Learn to spot red flags like sense of urgency, mismatched URLs, and spelling errors. Stay vigilant and verify before you click!",
        duration: "08:45",
        youtubeId: "L9_m252bM5Q",
        category: "Protection",
        icon: Lock
    },
    {
        id: "v3",
        title: "Two Factor Authentication Explained",
        description: "Why passwords aren't enough anymore and how to properly secure your accounts with 2FA and MFA.",
        summary: "Passwords alone are no longer sufficient against modern brute-force and credential stuffing attacks. This video explains how 2FA adds a critical second layer of security. We explore different methods including SMS codes, authenticator apps, and physical security keys.",
        duration: "06:30",
        youtubeId: "dp-D-d-0mF0",
        category: "Identity",
        icon: Fingerprint
    }
];

const articles = [
    {
        id: "a1",
        title: "The Rise of AI Phishing",
        category: "Threat Update",
        date: "Feb 2, 2026",
        readTime: "5 min read",
        content: "Artificial Intelligence is revolutionizing how attackers craft phishing messages. By using Large Language Models (LLMs), hackers can now generate perfectly written, highly personalized emails in seconds. Unlike traditional phishing, these AI-generated messages lack typical grammar errors and can mimic the exact tone of a trusted colleague. Organizations must adapt by using AI-driven detection tools and enhancing employee awareness training."
    },
    {
        id: "a2",
        title: "Securing Your Remote Workspace",
        category: "Best Practices",
        date: "Jan 28, 2026",
        readTime: "8 min read",
        content: "Working from home introduces unique security risks. From unsecured home Wi-Fi to the use of personal devices for work, the attack surface has expanded significantly. Key recommendations include: ALWAYS use a corporate VPN, enable hardware-based encryption on all devices, keep your router firmware updated, and maintain physical security by locking your workstation when away. Separation of personal and professional digital lives is crucial."
    },
    {
        id: "a3",
        title: "Understanding Zero-Knowledge Proofs",
        category: "Tech Explained",
        date: "Jan 15, 2026",
        readTime: "12 min read",
        content: "Zero-Knowledge Proofs (ZKPs) are a cryptographic breakthrough that allows one party to prove to another that they know a specific piece of information without actually revealing the information itself. In the context of cybersecurity, ZKPs can be used for secure authentication without transmitting passwords or for private transactions on a blockchain. This technology is at the forefront of privacy-preserving computation and will be a standard in future secure systems."
    },
    {
        id: "a4",
        title: "Password Manager Comparison 2026",
        category: "Tools",
        date: "Jan 10, 2026",
        readTime: "10 min read",
        content: "We audit the top 5 password managers of the year. From open-source options like Bitwarden to feature-rich commercial suites, we look at encryption standards, cloud vs local storage, and the robustness of their zero-knowledge architecture. Use a manager to ensure every account has a unique, high-entropy password."
    }
];

export function Learning() {
    const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
    const [isExploringAll, setIsExploringAll] = useState<boolean>(false);

    const handleOpenSummary = (v: typeof videos[0]) => setSelectedVideo(v);
    const handleOpenArticle = (a: typeof articles[0]) => setSelectedArticle(a);
    const handleToggleExplore = () => setIsExploringAll(!isExploringAll);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="space-y-1 text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Activity className="h-8 w-8 text-primary-500" />
                    Awareness Learning
                </h2>
                <p className="text-slate-400 max-w-2xl">
                    Master modern cybersecurity through high-quality video tutorials and deep-dive technical articles. Your frontline defense starts with education.
                </p>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => (
                        <Card key={video.id} className="flex flex-col bg-slate-900 border-slate-800 hover:border-primary-500/50 transition-all group overflow-hidden shadow-lg hover:shadow-primary-500/10">
                            <div className="aspect-video relative overflow-hidden bg-slate-800 border-b border-slate-800">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <CardHeader className="p-5 text-left">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className="bg-primary-500/10 text-primary-400 border-primary-500/20 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                                        {video.category}
                                    </Badge>
                                    <span className="text-[11px] text-slate-500 flex items-center font-medium">
                                        <Clock className="mr-1.5 h-3 w-3" />
                                        {video.duration}
                                    </span>
                                </div>
                                <CardTitle className="text-lg font-bold text-slate-100 line-clamp-1 group-hover:text-primary-400 transition-colors">{video.title}</CardTitle>
                                <CardDescription className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                    {video.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 mt-auto">
                                <Button 
                                    onClick={() => handleOpenSummary(video)}
                                    variant="outline" 
                                    className="w-full text-xs h-9 justify-center border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all"
                                >
                                    <BookOpen className="mr-2 h-3.5 w-3.5" /> Read Summary
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-3 text-left">
                    <Card className="md:col-span-2 bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-800">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">Security Quick-Reads</CardTitle>
                                <Button 
                                    onClick={handleToggleExplore}
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-primary-500 text-xs font-bold hover:bg-primary-500/10"
                                >
                                    View All
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-800/50">
                                {articles.slice(0, 3).map((article) => (
                                    <button 
                                        key={article.id}
                                        onClick={() => handleOpenArticle(article)}
                                        className="w-full flex items-center justify-between p-5 hover:bg-slate-800/30 transition-all text-left group"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] uppercase font-black text-primary-500 tracking-[0.2em]">{article.category}</span>
                                                <span className="text-slate-700">•</span>
                                                <span className="text-[10px] text-slate-500 font-medium">{article.date}</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-200 group-hover:text-white group-hover:translate-x-1 transition-all">{article.title}</h4>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] text-slate-500 font-mono hidden md:block">{article.readTime}</span>
                                            <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 relative overflow-hidden group shadow-xl">
                         <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 transition-transform duration-500 group-hover:scale-110">
                            <Shield className="h-44 w-44 text-primary-500" />
                        </div>
                        <CardHeader className="p-6">
                            <Badge className="w-fit mb-4 bg-primary-500/20 text-primary-400 border-none px-2 py-0.5 text-[10px] font-bold">INSIDER INFO</Badge>
                            <CardTitle className="text-2xl font-black text-white">Did You Know?</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-6 relative z-10 text-left">
                            <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                                "Over 90% of successful cyber attacks start with a phishing email. Education is your strongest firewall."
                            </p>
                            <div className="pt-2">
                                <Button 
                                    onClick={handleToggleExplore}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold h-11 shadow-lg shadow-primary-900/20 active:scale-[0.98] transition-all"
                                >
                                    Browse All Topics
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modals for Interactivity */}
            <Modal 
                isOpen={!!selectedVideo} 
                onClose={() => setSelectedVideo(null)} 
                title="Learning Summary"
            >
                {selectedVideo && (
                    <div className="space-y-4 text-left">
                        <div className="bg-primary-500/10 p-4 rounded-lg border border-primary-500/20">
                            <h4 className="font-bold text-primary-400 text-lg mb-2">{selectedVideo.title}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedVideo.duration}</span>
                                <span className="flex items-center gap-1 font-bold uppercase tracking-wider">{selectedVideo.category}</span>
                            </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed py-2">
                            {selectedVideo.summary}
                        </p>
                        <div className="pt-4 flex justify-end">
                            <Button onClick={() => setSelectedVideo(null)} className="bg-slate-800 hover:bg-slate-700 text-white border-none">
                                Got it, thanks!
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal 
                isOpen={!!selectedArticle} 
                onClose={() => setSelectedArticle(null)} 
                title="Full Article"
            >
                {selectedArticle && (
                    <div className="space-y-4 text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] uppercase font-black text-primary-500 tracking-widest">{selectedArticle.category}</span>
                            <span className="text-slate-700">•</span>
                            <span className="text-[10px] text-slate-500">{selectedArticle.date}</span>
                        </div>
                        <h4 className="font-bold text-white text-2xl mb-4 leading-tight">{selectedArticle.title}</h4>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-slate-300 text-base leading-relaxed">
                                {selectedArticle.content}
                            </p>
                        </div>
                        <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-xs text-slate-500 italic font-medium">Reading time: {selectedArticle.readTime}</span>
                            <Button onClick={() => setSelectedArticle(null)} className="bg-primary-600 hover:bg-primary-700 text-white border-none">
                                Back to Hub
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal 
                isOpen={isExploringAll} 
                onClose={() => setIsExploringAll(false)} 
                title="Explore All Topics"
            >
                <div className="grid gap-4 text-left">
                    <p className="text-slate-400 text-sm mb-2">Browse our full encyclopedia of security topics curated for you.</p>
                    <div className="space-y-3">
                        {articles.map((article) => (
                            <button 
                                key={article.id}
                                onClick={() => {
                                    setSelectedArticle(article);
                                    setIsExploringAll(false);
                                }}
                                className="w-full bg-slate-800/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-primary-500/50 hover:bg-slate-800 transition-all text-left group"
                            >
                                <div className="space-y-1">
                                    <Badge className="text-[8px] h-4 bg-primary-500/10 text-primary-400 border-none mb-1 font-bold">{article.category}</Badge>
                                    <h5 className="font-bold text-slate-200 text-sm group-hover:text-white">{article.title}</h5>
                                </div>
                                < ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-primary-500" />
                            </button>
                        ))}
                    </div>
                    <div className="pt-4">
                         <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <p className="text-[11px] text-blue-400 text-center font-bold uppercase tracking-wider">New topics added every Monday</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
'@
$content | Set-Content d:\SecureMate\src\pages\Learning.tsx -Encoding utf8
