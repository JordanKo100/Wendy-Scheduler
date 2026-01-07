import { useState, useEffect } from "react";
import { Calendar, Users, Clock, Phone, ChevronRight, Mail } from "lucide-react";

export default function Management() {
    const [panel, setPanel] = useState('appointments');
    const [bookings, setBookings] = useState([]);

    const todayDate = new Date();
    const todayLabel = todayDate.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const tomorrowDate = new Date();
    tomorrowDate.setDate(todayDate.getDate() + 1);
    const tomorrowLabel = tomorrowDate.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/reservations/get-all');
            const data = await response.json();
            if (data.success) {
                // Sorting logic: Date first, then Time
                const sorted = data.bookings.sort((a, b) => {
                    const dateDiff = new Date(a.date) - new Date(b.date);
                    return dateDiff !== 0 ? dateDiff : a.time.localeCompare(b.time);
                });
                setBookings(sorted);
            }
        } catch (err) {
            console.error("Fetch failed", err);
        }
    };

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(fetchBookings, 10000);
        return () => clearInterval(interval);
    }, []);

    const groupedBookings = bookings.reduce((groups, booking) => {
        const date = new Date(booking.date).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(booking);
        return groups;
    }, {});

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
                <div className="p-6">
                    <h2 className="text-2xl font-black italic text-[#ED1B24]">WENDY'S</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Management</p>
                </div>
                <nav className="mt-4">
                    <button 
                        onClick={() => setPanel('appointments')}
                        className={`w-full flex items-center px-6 py-4 transition-all ${panel === 'appointments' ? 'bg-[#FEF200]/10 text-[#ED1B24] border-r-4 border-[#ED1B24]' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Calendar className="mr-3" size={20} />
                        <span className="font-bold">Appointments</span>
                    </button>
                    <button 
                        onClick={() => setPanel('customers')}
                        className={`w-full flex items-center px-6 py-4 transition-all ${panel === 'customers' ? 'bg-[#FEF200]/10 text-[#ED1B24] border-r-4 border-[#ED1B24]' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Users className="mr-3" size={20} />
                        <span className="font-bold">Customers</span>
                    </button>
                </nav>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-8">
                {panel === 'appointments' && (
                    <div className="max-w-4xl animate-fadeIn">
                        <header className="mb-8 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900">Upcoming Schedule</h1>
                                <p className="text-gray-500">Managing {bookings.length} total reservations</p>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                                <span className="text-sm font-bold text-green-600">● Live Updates On</span>
                            </div>
                        </header>

                        <div className="space-y-10">
                            {Object.keys(groupedBookings).length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                    <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                                    <p className="text-gray-500 font-medium">No appointments scheduled yet.</p>
                                </div>
                            ) : (
                                Object.keys(groupedBookings).map(date => (
                                    <section key={date}>
                                        <div className="flex items-center mb-4">
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                            <span className={`px-4 text-sm font-black uppercase tracking-tighter ${
                                                    date === todayLabel ? 'text-[#ED1B24]' : 
                                                    date === tomorrowLabel ? 'text-[#0078c4]' : 
                                                    'text-gray-400'
                                                }`}>
                                                {date === todayLabel ? 'Today' : 
                                                date === tomorrowLabel ? 'Tomorrow' : 
                                                date}
                                            </span> 
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                        </div>

                                        <div className="grid gap-3">
                                            {groupedBookings[date].map(app => (
                                                <div key={app._id} className="group bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#FEF200] transition-all flex items-center justify-between">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="flex flex-col items-center justify-center bg-gray-50 group-hover:bg-[#FEF200] rounded-xl w-20 h-20 transition-colors">
                                                            <Clock size={16} className="text-gray-400 group-hover:text-[#ED1B24]" />
                                                            <span className="font-black text-lg text-gray-800">{app.time}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-900">{app.name}</h4>
                                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                                <Phone size={14} className="mr-1" />
                                                                {app.phone}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                                <Mail size={14} className="mr-1" />
                                                                {app.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-4">
                                                        {app.notes && (
                                                            <div className="hidden md:block text-right max-w-xs">
                                                                <p className="text-xs text-gray-400 italic">"{app.notes}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {panel === 'customers' && (
                    <div className="animate-fadeIn">
                        <h1 className="text-3xl font-black text-gray-900 mb-6">Customer Base</h1>
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
                           <Users size={48} className="mx-auto text-gray-200 mb-4" />
                           <p className="text-gray-500">Customer directory coming soon.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}