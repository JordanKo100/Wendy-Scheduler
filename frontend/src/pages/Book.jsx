import { useState } from "react";
import { Mail, User, Phone, Calendar, Clock } from "lucide-react";
import formatPhoneNumber from "../utils/phoneFormatter";

export default function Book({user, customerStatus}){
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'phone' ? formatPhoneNumber(value) : value;
        setFormData({ ...formData, [name]: finalValue });
    };

    const handleSubmit = (e) => {

    }

    return (
        <div>
            {customerStatus === 'guest' && (
                <form onSubmit={handleSubmit}>
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

                    <button type="submit">
                        Book Now
                    </button>
                </form>
            )}

            {customerStatus === 'customer' && (
                <form onSubmit={handleSubmit}>
                    <div>
                        
                    </div>
                </form>
            )}
        </div>
    )
}