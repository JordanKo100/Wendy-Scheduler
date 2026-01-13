import { useState, useEffect } from 'react';
import { User, Phone, Calendar, Clock, Scissors, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';

import NoAppointmentBox from '../components/NoAppointmentBox';
import BookButton from '../components/BookButton';

export default function Customer({ user }) {
    // 1. Move options to the top to prevent hoisting crashes
    const dateOption = {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',  
        timeZone: 'UTC'
    }

    const todayLabel = new Date().toLocaleDateString('en-US', dateOption);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowLabel = tomorrow.toLocaleDateString('en-US', dateOption);

    // 2. States
    const [isEditingProfileReservation, setisEditingProfileReservation] = useState(false);
    const [isEditingProfile, setisEditingProfile] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [profileBookings, setProfileBookings] = useState([]);

    // 3. Data Fetching
    const fetchProfileBookings = async () => {
        if (!user?.email) return;
        try {
            const response = await fetch(`/api/reservations/get-email/${user.email}`);
            const data = await response.json();
            if (data.success) {
                const sorted = data.bookings.sort((a, b) => {
                    const dateDiff = new Date(a.date) - new Date(b.date);
                    return dateDiff !== 0 ? dateDiff : a.time.localeCompare(b.time);
                });
                setProfileBookings(sorted);
            }
        } catch (err) {
            console.error("Fetch failed", err);
        }
    }

    useEffect(() => {
        fetchProfileBookings();
        const interval = setInterval(fetchProfileBookings, 10000);
        return () => clearInterval(interval);
    }, [user?.email]);

    // 4. Grouping Logic (Safe check included)
    const groupedBookings = profileBookings.reduce((groups, booking) => {
        const date = new Date(booking.date).toLocaleDateString('en-US', dateOption);
        if (!groups[date]) groups[date] = [];
        groups[date].push(booking);
        return groups;
    }, {});

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        const response = await fetch(`/api/reservations/update/${selectedApp._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },            
            body: JSON.stringify(selectedApp)
        });
        const data = await response.json();
        if (data.success) {
            setisEditingProfileReservation(false);
            fetchProfileBookings();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Visit Updated' });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Cancel Visit?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ED1B24',
            confirmButtonText: 'Yes, cancel it'
        });

        if (result.isConfirmed) {
            const response = await fetch(`/api/reservations/delete/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchProfileBookings();
                Swal.fire('Cancelled', 'Your visit was removed.', 'success');
            }
        }
    };

    return ( 
        <div className="min-h-screen bg-[#F9F8F6] py-12 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-12 bg-[#FEF200]"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Customer Profile</span>
                        </div>
                        <h1 className="text-5xl font-black italic tracking-tighter text-[#ED1B24] leading-none uppercase">
                            HELLO, {user?.username || 'Guest'}
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-6">
                        {/* CONTACT INFO BOX */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative group">
                            <button 
                                onClick={() => setisEditingProfile(true)}
                                className="absolute top-6 right-6 p-2 text-gray-300 hover:text-[#0078c4] transition-colors"
                            >
                                <Pencil size={18} />
                            </button>
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <User size={14} className="text-[#ED1B24]" /> Contact Info
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase">Username</p>
                                    <p className="font-bold text-gray-800">{user?.username}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase">Phone</p>
                                    <p className="font-bold text-gray-800">{user?.phone || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#ED1B24] rounded-[2rem] p-8 text-white shadow-xl">
                            <Scissors size={32} className="mb-4 text-[#FEF200]" />
                            <h3 className="font-black italic text-xl mb-2">Need a cut?</h3>
                            <BookButton className="w-full mt-4 py-3 bg-white text-[#ED1B24] font-black rounded-xl uppercase text-xs" />
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                            <Calendar size={14} className="text-[#0078c4]" /> Your Appointments
                        </h2>

                        <div className="space-y-10">
                            {Object.keys(groupedBookings).length === 0 ? (
                                <NoAppointmentBox />
                            ) : (
                                Object.keys(groupedBookings).map(date => (
                                    <section key={date}>
                                        <div className="flex items-center mb-4 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                                            <span className="mr-4 whitespace-nowrap">{date === todayLabel ? 'Today' : date === tomorrowLabel ? 'Tomorrow' : date}</span>
                                            <div className="h-px w-full bg-gray-100"></div>
                                        </div>
                                        <div className="grid gap-3">
                                            {groupedBookings[date].map(app => (
                                                <div key={app._id} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-transparent hover:border-[#FEF200] transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-[70px]">
                                                            <p className="text-xs font-black text-[#0078c4]">{app.time}</p>
                                                        </div>
                                                        <p className="font-bold text-gray-800">{app.service || 'Hair Service'}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { setSelectedApp(app); setisEditingProfileReservation(true); }} className="p-2 text-gray-400 hover:text-blue-500"><Pencil size={16}/></button>
                                                        <button onClick={() => handleDelete(app._id)} className="p-2 text-gray-400 hover:text-red-500"><Scissors size={16}/></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL: APPOINTMENT EDIT */}
            {isEditingProfileReservation && selectedApp && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-popIn">
                        <div className="bg-[#0078c4] p-6 border-b-4 border-[#FEF200]">
                            <h2 className="font-black italic text-white uppercase">Reschedule Visit</h2>
                        </div>
                        <form onSubmit={handleUpdateAppointment} className="p-8 space-y-4">
                            <input 
                                type="date"
                                className="w-full p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-[#0078c4] font-bold" 
                                value={selectedApp.date.split('T')[0]} 
                                onChange={(e) => setSelectedApp({...selectedApp, date: e.target.value})}
                            />
                            <input 
                                className="w-full p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-[#0078c4] font-bold" 
                                value={selectedApp.time} 
                                onChange={(e) => setSelectedApp({...selectedApp, time: e.target.value})}
                            />
                            <div className="flex gap-2 pt-4">
                                <button type="button" onClick={() => setisEditingProfileReservation(false)} className="flex-1 py-4 font-bold text-gray-400">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-[#0078c4] text-white font-black rounded-xl uppercase italic tracking-widest">Save Visit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}