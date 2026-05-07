import { useState, useEffect, useCallback } from 'react';
import { User, Phone, Calendar, Clock, Scissors, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';

import NoAppointmentBox from '../components/NoAppointmentBox';
import BookButton from '../components/BookButton';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

const dateOption = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
};

export default function Customer() {
    const { user } = useAuth();

    const todayLabel = new Date().toLocaleDateString('en-US', dateOption);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowLabel = tomorrow.toLocaleDateString('en-US', dateOption);

    const [isEditingProfileReservation, setIsEditingProfileReservation] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [profileBookings, setProfileBookings] = useState([]);

    const fetchProfileBookings = useCallback(async () => {
        if (!user?.email) return;
        try {
            const data = await api.get(`/reservations/get-email/${encodeURIComponent(user.email)}`);
            const sorted = (data.bookings || []).sort((a, b) => {
                const dateDiff = new Date(a.date) - new Date(b.date);
                return dateDiff !== 0 ? dateDiff : a.time.localeCompare(b.time);
            });
            setProfileBookings(sorted);
        } catch (err) {
            console.error('Fetch failed', err);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchProfileBookings();
        const interval = setInterval(fetchProfileBookings, 10000);
        return () => clearInterval(interval);
    }, [fetchProfileBookings]);

    const groupedBookings = profileBookings.reduce((groups, booking) => {
        const date = new Date(booking.date).toLocaleDateString('en-US', dateOption);
        if (!groups[date]) groups[date] = [];
        groups[date].push(booking);
        return groups;
    }, {});

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/reservations/update/${selectedApp._id}`, {
                date: selectedApp.date,
                time: selectedApp.time,
            });
            setIsEditingProfileReservation(false);
            fetchProfileBookings();
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Visit Updated', timer: 2000, showConfirmButton: false });
        } catch {
            Swal.fire('Error', 'Could not update the appointment.', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Cancel Visit?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ED1B24',
            confirmButtonText: 'Yes, cancel it',
        });
        if (!result.isConfirmed) return;

        try {
            await api.delete(`/reservations/delete/${id}`);
            fetchProfileBookings();
            Swal.fire('Cancelled', 'Your visit was removed.', 'success');
        } catch {
            Swal.fire('Error', 'Could not cancel the appointment.', 'error');
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
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative group">
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
                                    <p className="font-bold text-gray-800">{user?.phone}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase">Email</p>
                                    <p className="font-bold text-gray-800 break-all">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <BookButton className="block text-center px-8 py-4 bg-[#ED1B24] text-white font-black rounded-2xl uppercase italic tracking-widest hover:bg-black transition" />
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <Calendar size={14} className="text-[#0078c4]" /> Upcoming Visits
                            </h2>

                            <div className="space-y-8">
                                {Object.keys(groupedBookings).length === 0 ? (
                                    <NoAppointmentBox />
                                ) : (
                                    Object.keys(groupedBookings).map((date) => (
                                        <section key={date}>
                                            <div className="flex items-center mb-3">
                                                <span
                                                    className={`text-xs font-black uppercase tracking-widest ${
                                                        date === todayLabel
                                                            ? 'text-[#ED1B24]'
                                                            : date === tomorrowLabel
                                                            ? 'text-[#0078c4]'
                                                            : 'text-gray-400'
                                                    }`}
                                                >
                                                    {date === todayLabel ? 'Today' : date === tomorrowLabel ? 'Tomorrow' : date}
                                                </span>
                                            </div>
                                            {groupedBookings[date].map((app) => (
                                                <div
                                                    key={app._id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-2"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <Clock size={18} className="text-gray-400" />
                                                        <div>
                                                            <p className="font-bold text-gray-800">{app.time}</p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Phone size={12} /> {app.phone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedApp({ ...app });
                                                                setIsEditingProfileReservation(true);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-blue-500"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(app._id)}
                                                            className="p-2 text-gray-400 hover:text-red-500"
                                                        >
                                                            <Scissors size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </section>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                value={String(selectedApp.date).split('T')[0]}
                                onChange={(e) => setSelectedApp({ ...selectedApp, date: e.target.value })}
                            />
                            <input
                                className="w-full p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-[#0078c4] font-bold"
                                value={selectedApp.time}
                                onChange={(e) => setSelectedApp({ ...selectedApp, time: e.target.value })}
                            />
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingProfileReservation(false)}
                                    className="flex-1 py-4 font-bold text-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-[#0078c4] text-white font-black rounded-xl uppercase italic tracking-widest"
                                >
                                    Save Visit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}