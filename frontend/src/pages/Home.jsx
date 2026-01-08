import React from 'react';
import { Phone, MapPin, Clock, Scissors, ExternalLink } from 'lucide-react';

export default function Home({user}) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const hours = [
        { day: "Monday", time: "10:30 AM - 6:30 PM" },
        { day: "Tuesday", time: "Closed", closed: true },
        { day: "Wednesday", time: "10:30 AM - 6:30 PM" },
        { day: "Thursday", time: "10:30 AM - 6:30 PM" },
        { day: "Friday", time: "10:30 AM - 6:30 PM" },
        { day: "Saturday", time: "10:00 AM - 7:00 PM" },
        { day: "Sunday", time: "11:00 AM - 5:00 PM" },
    ];

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            <section className="px-6 pt-24 pb-20 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-1 w-12 bg-[#FEF200]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Since xxxx</span>
                    </div>
                    
                    {/* Main title uses #ED1B24 (Red) and #0056b3 (Blue) to match your sign */}
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4 leading-[0.85] text-[#ED1B24]">
                        WENDY’S 名流髮廊<br /> 
                        <span className="text-2xl md:text-6xl block mt-2 text-[#0056b3]">Hair Salon</span>
                    </h1>

                    <div className="max-w-xl mt-8">
                        <p className="text-xl leading-relaxed text-gray-900 font-medium mb-8">
                            Providing hair services in the Renfrew Collingwood area for over XX years at 
                            affordable prices that respect our neighbors.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            {/* If user is Admin, show Admin Panel. Otherwise, show Book Now. */}
                            {user?.role === 'admin' ? (
                                <a 
                                    href="/management" 
                                    className="px-10 py-4 bg-[#ED1B24] text-white font-black rounded-xl hover:bg-black transition-all transform active:scale-95 shadow-xl uppercase italic tracking-wider"
                                >
                                    Admin Panel
                                </a>
                            ) : (
                                <a 
                                    href="/booking" 
                                    className="px-10 py-4 bg-[#ED1B24] text-white font-black rounded-xl hover:bg-black transition-all transform active:scale-95 shadow-xl uppercase italic tracking-wider"
                                >
                                    Book Now
                                </a>
                            )}

                            <a 
                                href="tel:6044378861" 
                                className="px-10 py-4 bg-white text-[#0056b3] border-2 border-[#0056b3] rounded-xl font-black hover:bg-blue-50 transition-all flex items-center gap-2 uppercase tracking-wider text-sm"
                            >
                                <Phone size={18} /> (604) 437-8861
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative Scissors Icon in the background */}
                <Scissors className="absolute -right-10 -bottom-10 text-[#ED1B24] opacity-10 rotate-12" size={400} />
            </section>

            {/* --- INFO CARDS SECTION --- */}
            <section className="max-w-5xl mx-auto px-6 py-16 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Location Box */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                        <MapPin className="text-[#0056b3] mb-4" size={24} />
                        <h3 className="font-black uppercase text-xs tracking-widest text-gray-400 mb-2">Location</h3>
                        <p className="text-lg font-bold">2987 Rupert St,</p>
                        <p className="text-sm text-gray-500 mb-4">Vancouver, BC V5M 3T8</p>
                        <a href="https://maps.google.com" target="_blank" className="inline-flex items-center text-xs font-black text-[#0056b3] hover:underline">
                            OPEN IN MAPS <ExternalLink size={12} className="ml-1" />
                        </a>
                    </div>

                    {/* Schedule Box */}
                    <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                        <div className="flex items-center gap-2 mb-6">
                            <Clock className="text-[#ED1B24]" size={24} />
                            <h3 className="font-black uppercase text-xs tracking-widest text-gray-400">Weekly Hours</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
                            {hours.map(h => (
                                <div key={h.day} className={today === h.day ? "scale-105 transition-transform" : ""}>
                                    <p className={`text-xs font-black uppercase tracking-tighter ${today === h.day ? 'text-[#ED1B24]' : 'text-gray-400'}`}>
                                        {h.day} {today === h.day && "•"}
                                    </p>
                                    <p className={`text-sm font-bold ${h.closed ? 'text-red-600 italic' : 'text-gray-800'}`}>
                                        {h.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}