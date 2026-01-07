import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { Mail, User, Phone, Calendar, Clock } from "lucide-react";
import formatPhoneNumber from "../utils/formatPhoneNumber";
import generateTimeSlots from "../utils/generateTimeSlots";
import { useNavigate } from "react-router-dom";

export default function Book({user, customerStatus}){
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [takenSlots, setTakenSlots] = useState([]);

    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        notes: ""
    });

    // Whenever the date changes, ask the server which times are gone
    useEffect(() => {
        if (formData.date) {
            const fetchAvailability = async () => {
                const res = await fetch(`/api/reservations/check-availability/${formData.date}`);
                const data = await res.json();
                if (data.success) setTakenSlots(data.takenSlots);
            };
            fetchAvailability();
        }
    }, [formData.date]);

    useEffect(() => {
        // If a customer is logged in, pre-fill the form with their account data
        if (customerStatus === 'customer' && user) {
            setFormData(prev => ({
                ...prev,
                name: user.username || "", // Map 'username' from DB to 'name' in form
                email: user.email || "",
                phone: user.phone || ""
            }));
        }
    }, [user, customerStatus]); // This runs whenever 'user' or 'status' changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'phone' ? formatPhoneNumber(value) : value;
        
        setFormData({ ...formData, [name]: finalValue });
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    // 1. Create a date object from the form state
    // We use getUTCDay to avoid timezone shifting issues with YYYY-MM-DD strings
    const dateObj = new Date(formData.date);
    const day = dateObj.getUTCDay();

    if (day === 2) {
        Swal.fire({
            title: 'Closed on Tuesdays',
            text: "Wendy's is resting up today! Please choose any other day of the week.",
            icon: 'info',
            confirmButtonColor: '#0078c4'
        });
        return;
    }

    try {
        const response = await fetch('/api/reservations/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();

        if (data.success) {
            Swal.fire({
                title: 'Appointment Booked!',
                text: `We'll see you on ${formData.date}`,
                icon: 'success',
                confirmButtonColor: '#ED1B24',
                customClass: {
                    title: 'font-black italic text-2xl',
                    confirmButton: 'rounded-xl font-bold px-8'
                }
            });
            
            // Optional: Clear form after success
            setFormData({
                ...formData,
                date: "",
                time: "",
                notes: ""
            });
        } else {
            setError(data.message || "Something went wrong. Please try again.");
        }
    } catch (err) {
        console.error("Connection Failed:", err);
        setError("Could not connect to the server. Please check your internet.");
    }
};

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
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-gray-500 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                            <input 
                                                type="text" name="name" placeholder="John Doe"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#ED1B24] outline-none transition-all"
                                                value={formData.name} onChange={handleChange} required
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
                                                type="text" name="phone" placeholder="(123) 456-7890"
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
                                                .filter(slot => !takenSlots.includes(slot)) // <--- THE FILTER
                                                .map((slot, index) => (
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