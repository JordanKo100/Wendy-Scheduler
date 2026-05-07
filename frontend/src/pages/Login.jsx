import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const user = await login(formData.email, formData.password);

            // If they were redirected here from a guarded route, send them back.
            const from = location.state?.from?.pathname;
            if (from) return navigate(from, { replace: true });

            navigate(user.role === 'admin' ? '/management' : '/customer');
        } catch (err) {
            if (err.status === 401) setError('Invalid email or password.');
            else if (err.status === 429) setError('Too many attempts. Try again in a few minutes.');
            else if (err.status === 400) setError('Please check your email and password.');
            else setError('Connection failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-[#FEF200] h-3 w-full"></div>
                <div className="bg-[#ED1B24] h-1 w-full"></div>

                <div className="p-10">
                    <div className="mb-10 text-left">
                        <h2 className="text-[#0078c4] font-bold uppercase tracking-widest text-xs mb-1">
                            Welcome Back
                        </h2>
                        <h1 className="text-3xl font-black italic text-[#ED1B24] tracking-tight">Login</h1>
                        <div className="h-1 w-12 bg-[#FEF200] mt-2"></div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center animate-shake">
                            <svg className="h-5 w-5 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="ml-3 text-sm font-bold text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-[#0078c4] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#ED1B24] hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 transform transition active:scale-[0.98] mt-4"
                        >
                            {submitting ? 'Signing In…' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?
                            <Link
                                to="/signup"
                                className="ml-2 text-[#0078c4] font-bold hover:text-blue-800 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}