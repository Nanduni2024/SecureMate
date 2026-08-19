import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import Logo from '../assets/Logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useApi } from '../lib/api';
import { isAxiosError } from 'axios';

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { addToast } = useToast();
  const api = useApi();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        login(token);
        navigate('/dashboard');
      } catch {
        addToast('Invalid login token', 'error');
      }
    }
  }, [searchParams, navigate, login, addToast]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google/verify', {
        credential: credentialResponse.credential
      });
      login(res.data.token);
      addToast('Welcome back! Login successful.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Google authentication failed. Please try again.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.id]: undefined });
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.token);
      addToast('Welcome back! You are now logged in.', 'success');
      navigate('/dashboard');
    } catch (err) {
      if (isAxiosError(err)) {
        addToast(err.response?.data?.msg || 'Login failed. Please check your credentials.', 'error');
      } else {
        addToast('An unexpected error occurred. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <div className="hidden lg:flex w-1/2 bg-slate-950 items-center justify-center relative border-r border-slate-800">
        <div className="relative z-10 p-12 text-center max-w-lg">
          <img src={Logo} alt="SecureMate Logo" className="h-20 w-20 mx-auto mb-8" />
          <h1 className="text-4xl font-bold tracking-tight-premium mb-6">Your Digital Fortress, Secured.</h1>
          <p className="text-lg text-slate-400">
            "SecureMate uses advanced AI to detect threats before they harm your device. Experience peace of mind."
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>— Alex P., Cybersecurity Enthusiast</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center space-y-2 text-center">
            <img src={Logo} alt="SecureMate Logo" className="h-10 w-10 lg:hidden" />
            <h2 className="text-3xl font-bold tracking-tight">Access Your Vault</h2>
            <p className="text-slate-400">Enter your credentials to access your dashboard.</p>
          </div>

          <Card className="border-slate-800 bg-slate-900 shadow-sm hover:shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl tracking-tight">Login</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 gap-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => addToast('Google Login Failed', 'error')}
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
              <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.password}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
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
