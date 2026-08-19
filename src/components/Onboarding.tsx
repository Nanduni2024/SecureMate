import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight, Shield, Search, BookOpen, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface OnboardingStep {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const steps: OnboardingStep[] = [
    {
        title: 'Welcome to SecureMate',
        description: 'Your personal AI-powered cybersecurity command center. Let\'s take a quick tour of what you can do here.',
        icon: <Shield className="h-8 w-8" />,
        color: 'text-primary-400'
    },
    {
        title: 'Scan URLs for Threats',
        description: 'Use the URL scanner to check suspicious links. Our AI analyzes them for phishing, malware, and other threats in real-time.',
        icon: <Search className="h-8 w-8" />,
        color: 'text-emerald-400'
    },
    {
        title: 'Learn & Stay Safe',
        description: 'Visit the Learning Hub for curated security tutorials and articles. Knowledge is your best defense against cyber threats.',
        icon: <BookOpen className="h-8 w-8" />,
        color: 'text-blue-400'
    },
    {
        title: 'Secure Your Data',
        description: 'Store passwords and sensitive information in your encrypted Cyber Vault. Access them safely from any device.',
        icon: <Lock className="h-8 w-8" />,
        color: 'text-amber-400'
    }
];

export function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [showOnboarding, setShowOnboarding] = useState(() => {
        return !localStorage.getItem('securemate_onboarding_seen');
    });

    const handleComplete = () => {
        localStorage.setItem('securemate_onboarding_seen', 'true');
        setShowOnboarding(false);
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    if (!showOnboarding) return null;

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
                <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-10"
                    aria-label="Skip onboarding"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8 text-center">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`inline-flex items-center justify-center h-20 w-20 rounded-full bg-slate-800 border border-slate-700 mb-6 ${step.color}`}
                    >
                        {step.icon}
                    </motion.div>

                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>
                        <p className="text-slate-400 leading-relaxed">{step.description}</p>
                    </motion.div>

                    <div className="flex items-center justify-center gap-2 mt-8">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-primary-500' : 'w-1.5 bg-slate-700'}`}
                            />
                        ))}
                    </div>

                    <div className="flex gap-3 mt-8">
                        <Button variant="ghost" onClick={handleSkip} className="flex-1">
                            Skip
                        </Button>
                        <Button onClick={handleNext} className="flex-1">
                            {currentStep < steps.length - 1 ? (
                                <>Next <ChevronRight className="ml-2 h-4 w-4" /></>
                            ) : (
                                'Get Started'
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
