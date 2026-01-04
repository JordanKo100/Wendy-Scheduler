import { useState } from "react";
import { Mail, User, Phone, Calendar, Clock } from "lucide-react";
import formatPhoneNumber from "../utils/formatPhoneNumber";
import generateTimeSlots from "../utils/generateTimeSlots";

export default function Book({user, customerStatus}){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        notes: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'phone' ? formatPhoneNumber(value) : value;
        setFormData({ ...formData, [name]: finalValue });
    };

    const handleSubmit = (e) => {
        // TODO: add mongoDB connection for appointments
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                
                {/* --- THE AWNING ACCENT --- */}
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. CONTACT INFO SECTION (Only for Guests) */}
                        {customerStatus === 'guest' && (
                            <div className="space-y-4 animate-fadeIn">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            <input 
                                                type="email" name="email" placeholder="name@example.com"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                                value={formData.email} onChange={handleChange} required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            <input 
                                                type="text" name="phone" placeholder="(604) 000-0000"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                                value={formData.phone} onChange={handleChange} required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. LOGGED IN GREETING */}
                        {customerStatus === 'customer' && (
                            <div className="p-4 bg-blue-50 border-l-4 border-[#0078c4] rounded-r-xl mb-6">
                                <p className="text-sm text-[#0078c4] font-medium">
                                    Welcome back, <span className="font-bold">{user?.username}</span>! We've pre-filled your contact details.
                                </p>
                            </div>
                        )}

                        {/* 3. APPOINTMENT DETAILS (Shared) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="date" name="date"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                        value={formData.date} onChange={handleChange} required
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
                                        {generateTimeSlots().map((slot, index) => (
                                            <option key={index} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* --- NEW NOTES SECTION --- */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                                Special Requests / Notes
                            </label>
                            <textarea 
                                name="notes"
                                rows="3"
                                placeholder="e.g., I'd like a wash and dry, or I have a specific stylist preference..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] focus:ring-2 focus:ring-red-100 outline-none transition-all resize-none"
                                value={formData.notes}
                                onChange={handleChange}
                            ></textarea>
                            <p className="text-[10px] text-gray-400 ml-1 italic">
                                Optional: Tell us anything we should know before your visit.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-[#ED1B24] hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 transform transition active:scale-[0.98] mt-6"
                        >
                            Confirm Booking
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}