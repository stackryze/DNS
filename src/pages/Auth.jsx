import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Github, Mail, Lock, User, ArrowRight, Loader2, KeyRound, Eye, EyeOff, X, Check, ArrowLeft } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import api from '../services/api';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(location.pathname === '/login');
    const [loading, setLoading] = useState(false);
    
    // Turnstile toggle - set to false in local development
    const enableTurnstile = import.meta.env.VITE_ENABLE_TURNSTILE === 'true';

    // Multi-step Signup
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); // Success messages

    // Forgot Password Mode
    const [forgotMode, setForgotMode] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP & New Password

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [otp, setOtp] = useState("");
    const [turnstileToken, setTurnstileToken] = useState("");

    // Handle GitHub OAuth callback
    useEffect(() => {
        if (location.pathname === '/auth/callback') {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');

            if (token) {
                localStorage.setItem('token', token);
                navigate('/dashboard');
            } else if (error) {
                const errorMessages = {
                    'no_account': 'No account found. Please create an account first using email and password.',
                    'not_verified': 'Please verify your account with the OTP sent to your email before using GitHub signin.',
                    'no_verified_email': 'No verified email found on your GitHub account. Please verify your email on GitHub first.',
                    'github_auth_failed': 'GitHub authentication failed. Please try again.'
                };
                setError(errorMessages[error] || 'Authentication failed. Please try again.');
                navigate('/login', { replace: true });
            }
        }
    }, [location, navigate]);

    useEffect(() => {
        setIsLogin(location.pathname === '/login');
        setStep(1);
        setError("");
        setMessage("");
        setOtp("");
        setTurnstileToken("");
        setPassword("");
        setForgotMode(false);
        setResetStep(1);
    }, [location.pathname]);

    // Validation
    const validatePassword = (pass) => {
        const minLength = pass.length >= 8;
        const hasUpper = /[A-Z]/.test(pass);
        const hasLower = /[a-z]/.test(pass);
        const hasNumber = /[0-9]/.test(pass);
        const hasSpecial = /[^A-Za-z0-9]/.test(pass);
        return {
            isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
            checks: { minLength, hasUpper, hasLower, hasNumber, hasSpecial }
        };
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (enableTurnstile && !turnstileToken) {
            setError("Please complete the security check");
            return;
        }
        setLoading(true);
        setError("");
        try {
            // In a real app, send turnstileToken to backend for verification
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
            setTurnstileToken(""); // Reset token on error
        } finally {
            setLoading(false);
        }
    };

    const handleSignupStep1 = async (e) => {
        e.preventDefault();
        const { isValid } = validatePassword(password);
        if (!isValid) {
            setError("Password does not meet security requirements");
            return;
        }


        if (enableTurnstile && !turnstileToken) {
            setError("Please complete the security check");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await api.post('/auth/send-otp', { email, name });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSignupStep2 = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post('/auth/verify-otp', { email, name, password, otp });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    // Forgot Password Handlers
    const handleForgotSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            await api.post('/auth/forgot-password', { email });
            setResetStep(2);
            setMessage("Verification code sent to your email.");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send code");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const { isValid } = validatePassword(password);
        if (!isValid) {
            setError("New password does not meet security requirements");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword: password });
            setMessage("Password reset successfully. Please login.");
            setTimeout(() => {
                setForgotMode(false);
                setIsLogin(true);
                setPassword("");
                setOtp("");
                setMessage("");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    const passwordValidation = validatePassword(password);

    return (
        <div className="min-h-screen bg-[#1A1A1A] flex flex-col justify-center items-center p-4 relative overflow-hidden bg-[url('/pixel_art_large.png')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

            <div className="relative z-10 mb-8 flex items-center gap-3">
                <img src="/stackryze_logo1.png" alt="Stackryze" className="h-10 w-auto brightness-0 invert" />
                <span className="text-2xl font-bold text-white tracking-tight">Stackryze DNS</span>
            </div>

            <div className="relative z-10 w-full max-w-md bg-[#262626]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 transition-all duration-300">

                {/* Back Button for Forgot Pass */}
                {forgotMode && (
                    <button onClick={() => setForgotMode(false)} className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </button>
                )}

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {forgotMode
                            ? (resetStep === 1 ? "Reset Password" : "Confirm Reset")
                            : (isLogin ? "Welcome back" : step === 2 ? "Verify Email" : "Create an account")}
                    </h2>
                    <p className="text-[#A3A3A3] text-sm">
                        {forgotMode
                            ? "Recover access to your account"
                            : (isLogin
                                ? "Enter your credentials to access your dashboard"
                                : step === 2
                                    ? `We sent a code to ${email}`
                                    : "Start managing your domains for free today")}
                    </p>
                </div>

                {/* LOGIN Only: GitHub Button (Hidden in Forgot Mode) */}
                {isLogin && !forgotMode && (
                    <button 
                        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`}
                        className="w-full bg-[#24292e] hover:bg-[#2f363d] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all border border-white/10 hover:border-white/20 mb-6 font-mono text-sm group"
                    >
                        <Github className="w-5 h-5 group-hover:scale-110 transition-transform" /> Sign in with GitHub
                    </button>
                )}

                {/* LOGIN Only: Divider */}
                {isLogin && !forgotMode && (
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="absolute inset-x-0 h-px bg-[#333]"></div>
                        <span className="relative bg-[#202020] px-3 text-xs text-[#666] uppercase tracking-wider font-bold rounded-full">Or with Email</span>
                    </div>
                )}

                {/* Messages */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center flex items-center justify-center gap-2">
                        <X className="w-4 h-4" /> {error}
                    </div>
                )}
                {message && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> {message}
                    </div>
                )}

                {/* FORGOT PASSWORD FORM */}
                {forgotMode ? (
                    resetStep === 1 ? (
                        <form onSubmit={handleForgotSendOtp} className="space-y-4">
                            <InputGroup label="Email" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="name@company.com" />
                            <SubmitButton loading={loading} text="Send Reset Code" />
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wide ml-1">Verification Code</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        className="w-full bg-[#1A1A1A] border border-[#333] text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all placeholder-[#444] text-center text-xl tracking-[0.5em] font-mono"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <InputGroup label="New Password" icon={Lock} type="password" value={password} onChange={setPassword} placeholder="New password" />
                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 p-2 bg-black/20 rounded-lg">
                                    <ValidationItem passed={passwordValidation.checks.minLength} text="Min 8 chars" />
                                    <ValidationItem passed={passwordValidation.checks.hasUpper} text="Uppercase" />
                                    <ValidationItem passed={passwordValidation.checks.hasLower} text="Lowercase" />
                                    <ValidationItem passed={passwordValidation.checks.hasNumber} text="Number" />
                                    <ValidationItem passed={passwordValidation.checks.hasSpecial} text="Symbol" />
                                </div>
                            )}
                            <SubmitButton loading={loading} text="Reset Password" />
                        </form>
                    )
                ) : (
                    /* LOGIN & SIGNUP FORMS */
                    <>
                        {isLogin && (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <InputGroup label="Email" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="name@company.com" />
                                <InputGroup label="Password" icon={Lock} type="password" value={password} onChange={setPassword} placeholder="••••••••" />

                                <div className="flex justify-end">
                                    <button type="button" onClick={() => setForgotMode(true)} className="text-xs text-[#38BDF8] hover:text-[#0EA5E9] font-medium transition-colors">
                                        Forgot Password?
                                    </button>
                                </div>

                                {enableTurnstile && (
                                    <div className="flex justify-center my-4">
                                        <Turnstile
                                            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                            onSuccess={setTurnstileToken}
                                            options={{ theme: 'dark' }}
                                        />
                                    </div>
                                )}
                                <SubmitButton loading={loading} text="Sign In" />
                            </form>
                        )}



                        {!isLogin && step === 1 && (
                            <form onSubmit={handleSignupStep1} className="space-y-4">
                                <InputGroup label="Full Name" icon={User} type="text" value={name} onChange={setName} placeholder="John Doe" />
                                <InputGroup label="Email" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="name@company.com" />
                                <InputGroup label="Password" icon={Lock} type="password" value={password} onChange={setPassword} placeholder="••••••••" />

                                {password && (
                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 p-2 bg-black/20 rounded-lg">
                                        <ValidationItem passed={passwordValidation.checks.minLength} text="Min 8 chars" />
                                        <ValidationItem passed={passwordValidation.checks.hasUpper} text="Uppercase" />
                                        <ValidationItem passed={passwordValidation.checks.hasLower} text="Lowercase" />
                                        <ValidationItem passed={passwordValidation.checks.hasNumber} text="Number" />
                                        <ValidationItem passed={passwordValidation.checks.hasSpecial} text="Symbol" />
                                    </div>
                                )}

                                {enableTurnstile && (
                                    <div className="flex justify-center my-4">
                                        <Turnstile
                                            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                                            onSuccess={setTurnstileToken}
                                            options={{ theme: 'dark' }}
                                        />
                                    </div>
                                )}

                                <SubmitButton loading={loading} text="Send Verification Code" />
                            </form>
                        )}

                        {!isLogin && step === 2 && (
                            <form onSubmit={handleSignupStep2} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wide ml-1">Verification Code</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                            placeholder="123456"
                                            className="w-full bg-[#1A1A1A] border border-[#333] text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all placeholder-[#444] text-center text-2xl tracking-[0.5em] font-mono"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <SubmitButton loading={loading} text="Verify & Create Account" />
                                <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-[#666] hover:text-white mt-2">Go Back</button>
                            </form>
                        )}

                        <div className="mt-8 text-center">
                            <p className="text-[#A3A3A3] text-sm">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                <Link to={isLogin ? "/signup" : "/login"} className="font-bold text-white hover:text-[#38BDF8] transition-colors ml-1">
                                    {isLogin ? "Sign up" : "Sign in"}
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const ValidationItem = ({ passed, text }) => (
    <div className={`flex items-center gap-1.5 ${passed ? "text-[#38BDF8]" : "text-gray-500"}`}>
        {passed ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-600"></div>}
        <span>{text}</span>
    </div>
);

const InputGroup = ({ label, icon: Icon, type, value, onChange, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#A3A3A3] uppercase tracking-wide ml-1">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
                <input
                    type={inputType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-white rounded-xl py-2.5 pl-10 pr-10 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all placeholder-[#444]"
                    required
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </div>
    );
};

const SubmitButton = ({ loading, text }) => (
    <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
                {text} <ArrowRight className="w-5 h-5" />
            </>
        )}
    </button>
);

export default Auth;
