import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import Logo from '../assets/Logo.png';
import api from '../lib/api';
import { isAxiosError } from 'axios';

export function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setLoading(true);
        try {
            const res = await api.post('/auth/google/verify', {
                credential: credentialResponse.credential
            });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError('Google authentication failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/dashboard');
        }
    }, [searchParams, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.msg || 'Login failed');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-50">
            <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900/20 backdrop-blur-3xl z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[100px] z-0"></div>
                <div className="relative z-10 p-12 text-center max-w-lg">
                    <img src={Logo} alt="SecureMate Logo" className="h-20 w-20 mx-auto mb-8" />
                    <h1 className="text-5xl font-bold tracking-tight mb-6">Your Digital Fortress, Secured.</h1>
                    <p className="text-xl text-slate-400">
                        "SecureMate uses advanced AI to detect threats before they harm your device. Experience peace of mind."
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-500">
                        <span>— Alex P., Cybersecurity Enthusiast</span>
                    </div>
                </div>
                {/* Placeholder for abstract tech image */}
                <div className="absolute inset-0 z-[-1] opacity-20 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <img src={Logo} alt="SecureMate Logo" className="h-10 w-10 lg:hidden" />
                        <h2 className="text-3xl font-bold tracking-tight">Access Your Vault</h2>
                        <p className="text-slate-400">Enter your credentials to access your dashboard.</p>
                    </div>

                    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>Enter your email below to login to your account</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                            <div className="grid grid-cols-1 gap-6">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google Login Failed')}
                                    theme="filled_black"
                                    width="100%"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="email">Email</label>
                                <Input id="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="password">Password</label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="pr-10"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button className="w-full" onClick={handleLogin} disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                            <div className="text-center text-sm text-slate-500">
                                Don't have an account? <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium">Register</Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
