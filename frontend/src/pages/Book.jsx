import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Mail, User, Phone, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import formatPhoneNumber from '../utils/formatPhoneNumber';
import generateTimeSlots from '../utils/generateTimeSlots';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

export default function Book() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const [error, setError] = useState('');
    const [takenSlots, setTakenSlots] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        notes: '',
    });

    // Pre-fill from logged-in user.
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
            }));
        }
    }, [user]);

    // Fetch availability when the date changes.
    useEffect(() => {
        if (!formData.date) return;
        let cancelled = false;
        (async () => {
            try {
                // Public endpoint, no auth needed.
                const data = await api.get(
                    `/reservations/check-availability/${formData.date}`,
                    { auth: false },
                );
                if (!cancelled) setTakenSlots(data.takenSlots || []);
            } catch {
                if (!cancelled) setTakenSlots([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [formData.date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'phone' ? formatPhoneNumber(value) : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Booking now requires auth on the server. Send guests to login.
        if (!isLoggedIn) {
            navigate('/login', { state: { from: { pathname: '/booking' } } });
            return;
        }

        const day = new Date(formData.date).getUTCDay();
        if (day === 2) {
            Swal.fire({
                title: 'Closed on Tuesdays',
                text: "Wendy's is resting up today! Please choose any other day of the week.",
                icon: 'info',
                confirmButtonColor: '#0078c4',
            });
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/reservations/create', formData);
            Swal.fire({
                title: 'Appointment Booked!',
                text: `We'll see you on ${formData.date}`,
                icon: 'success',
                confirmButtonColor: '#ED1B24',
                customClass: {
                    title: 'font-black italic text-2xl',
                    confirmButton: 'rounded-xl font-bold px-8',
                },
            });
            setFormData((prev) => ({ ...prev, date: '', time: '', notes: '' }));
            setTakenSlots([]);
        } catch (err) {
            if (err.status === 403) {
                setError('You can only book under your own account email.');
            } else if (err.status === 400) {
                setError('Please check your booking details.');
            } else if (err.status === 500) {
                // Most likely the unique-index collision on (date, time) — slot just got taken.
                setError('That time slot is no longer available. Please pick another.');
            } else {
                setError('Could not connect to the server. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-[#FEF200] h-3 w-full"></div>
                <div className="bg-[#ED1B24] h-1 w-full"></div>

                <div className="p-10">
                    <div className="mb-8 text-left">
                        <h2 className="text-[#0078c4] font-bold uppercase tracking-widest text-xs mb-1">
                            Reservations
                        </h2>
                        <h1 className="text-3xl font-black italic text-[#ED1B24] tracking-tight">
                            Book Appointment
                        </h1>
                        <div className="h-1 w-12 bg-[#FEF200] mt-2"></div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <p className="text-sm font-bold text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLoggedIn && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="p-4 bg-yellow-50 border-l-4 border-[#FEF200] rounded-r-xl mb-2">
                                    <p className="text-sm text-gray-700">
                                        You'll need to sign in or create an account to book. Fill out your details below
                                        and we'll guide you through it.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="John Doe"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="name@example.com"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="phone"
                                                placeholder="(123) 456-7890"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLoggedIn && (
                            <div className="p-4 bg-blue-50 border-l-4 border-[#0078c4] rounded-r-xl mb-6">
                                <p className="text-sm text-[#0078c4] font-medium">
                                    Welcome back, <span className="font-bold">{user.username}</span>! We've pre-filled
                                    your contact details.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="date"
                                        min={today}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <select
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all appearance-none"
                                        required
                                    >
                                        <option value="">Select Time</option>
                                        {generateTimeSlots()
                                            .filter((slot) => !takenSlots.includes(slot))
                                            .map((slot, index) => (
                                                <option key={index} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                                Special Requests / Notes
                            </label>
                            <textarea
                                name="notes"
                                rows="3"
                                maxLength={500}
                                placeholder="e.g., I'd like a wash and dry, or I have a specific stylist preference..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] focus:ring-2 focus:ring-red-100 outline-none transition-all resize-none"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                            <p className="text-[10px] text-gray-400 ml-1 italic">
                                Optional: Tell us anything we should know before your visit.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#ED1B24] hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 transform transition active:scale-[0.98] mt-6"
                        >
                            {submitting ? 'Booking…' : 'Confirm Booking'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}