import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, Phone, Eye, EyeOff } from "lucide-react"; // Added icons for consistent look
import formatPhoneNumber from "../utils/formatPhoneNumber";

import Swal from 'sweetalert2';

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: '', passwordConfirm: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmSignup, setConfirmSignup] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'phone' ? formatPhoneNumber(value) : value;
        setFormData({ ...formData, [name]: finalValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 1. Password Match Validation
        if (formData.password !== formData.passwordConfirm) {
            return setError("Passwords Do Not Match");
        }

        // 2. Trigger Detailed Confirmation Box
        Swal.fire({
            title: 'VERIFY YOUR INFO',
            // We use 'html' instead of 'text' to allow bolding and line breaks
            html: `
                <div style="text-align: left; background: #f9f9f9; padding: 20px; border-radius: 15px; border: 1px solid #eee;">
                    <p style="margin-bottom: 8px;"><strong style="color: #ED1B24;">NAME:</strong> ${formData.firstName} ${formData.lastName}</p>
                    <p style="margin-bottom: 8px;"><strong style="color: #ED1B24;">EMAIL:</strong> ${formData.email}</p>
                    <p style="margin-bottom: 0;"><strong style="color: #ED1B24;">PHONE:</strong> ${formData.phone}</p>
                </div>
                <p style="margin-top: 15px; font-size: 0.9em; color: #666;">Is this information correct?</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#ED1B24', // Wendy's Red
            cancelButtonColor: '#999',
            confirmButtonText: 'YES, CREATE ACCOUNT',
            cancelButtonText: 'EDIT INFO',
            customClass: {
                title: 'font-black italic uppercase text-xl',
                popup: 'rounded-3xl border-4 border-[#FEF200]' // Wendy's Yellow
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // 3. Check if user exists
                    const checkResponse = await fetch('/api/auth/check-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: formData.email })
                    });
                    const checkResult = await checkResponse.json();

                    if (checkResult.exists) {
                        return setError("Email already in use. Please log in.");
                    }

                    // 4. Perform Signup
                    const response = await fetch('/api/auth/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });

                    if (response.ok) {
                        Swal.fire({
                            title: 'WELCOME TO WENDY\'S!',
                            text: 'Your account is ready.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        navigate('/login');
                    } else {
                        setError("Failed to create account. Please try again.");
                    }
                } catch (err) {
                    console.error("Signup error:", err);
                    setError("Connection error. Please check your internet.");
                }
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                
                {/* Awning Accent */}
                <div className="bg-[#FEF200] h-3 w-full"></div>
                <div className="bg-[#ED1B24] h-1 w-full"></div>

                <div className="p-10">
                    <div className="mb-8 text-left">
                        <h2 className="text-[#0078c4] font-bold uppercase tracking-widest text-xs mb-1">Welcome!</h2>
                        <h1 className="text-3xl font-black italic text-[#ED1B24] tracking-tight">Create an Account</h1>
                        <div className="h-1 w-12 bg-[#FEF200] mt-2"></div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center animate-shake">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-bold text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input 
                                    type="email" name="email" placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                                    value={formData.email} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        {/* Name Grid - Two columns on larger screens */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="text" name="firstName" placeholder="First Name"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                        value={formData.firstName} onChange={handleChange} required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Last Name</label>
                                <input 
                                    type="text" name="lastName" placeholder="Last Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                    value={formData.lastName} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input 
                                    type="text" name="phone" placeholder="(604) 000-0000"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                    value={formData.phone} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative pt-6">
                                <label className="absolute top-0 left-1 text-xs font-bold uppercase text-gray-500">Password</label>
                                <input 
                                    type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ED1B24] outline-none transition-all"
                                    value={formData.password} onChange={handleChange} required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="relative pt-6">
                                <label className="absolute top-0 left-1 text-xs font-bold uppercase text-gray-500">Confirm</label>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} name="passwordConfirm" placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ED1B24] outline-none transition-all"
                                    value={formData.passwordConfirm} onChange={handleChange} required
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-400">
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#ED1B24] hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 transition-all active:scale-[0.98] mt-4">
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
                        <p className="text-sm text-gray-500">
                            Already have an account? 
                            <Link to="/login" className="ml-2 text-[#0078c4] font-bold hover:text-blue-800">Login</Link>
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                            For Admin signup please contact <span className="text-gray-600">(604)-566-4777</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}