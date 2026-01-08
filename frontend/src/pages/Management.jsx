import { useState, useEffect } from "react";
import { Calendar, Users, Clock, Phone, Pencil } from "lucide-react";
import Swal from 'sweetalert2';


export default function Management() {
    const [panel, setPanel] = useState('appointments');
    const [bookings, setBookings] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);

    const dateOption = {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',  
        timeZone: 'UTC'
    }

    const handleDelete = async (id) => {
        // 1. Trigger the Swal Confirmation
        Swal.fire({
            title: 'Delete Appointment?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ED1B24', // Wendy's Red
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                title: 'font-black italic uppercase text-xl',
                popup: 'rounded-3xl border-4 border-[#FEF200]' // Wendy's Yellow border
            }
        }).then(async (result) => {
            // 2. If user confirmed, proceed with deletion
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/reservations/delete/${id}`, { 
                        method: 'DELETE' 
                    });
                    const data = await response.json();

                    if (data.success) {
                        // Success Toast/Alert
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'The appointment has been removed.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        
                        // 3. Refresh the UI
                        fetchBookings();
                    }
                } catch (err) {
                    console.error("Delete failed", err);
                    Swal.fire('Error', 'Could not delete the appointment.', 'error');
                }
            }
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/reservations/update/${selectedApp._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },            
            body: JSON.stringify(selectedApp)
        });

        const data = await response.json();
        if (data.success){
            setIsEditing(false);
            fetchBookings();
            
            // Add this for a better experience:
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Changes saved!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const todayDate = new Date();
    const todayLabel = todayDate.toLocaleDateString('en-US', dateOption);

    const tomorrowDate = new Date();
    tomorrowDate.setDate(todayDate.getDate() + 1);
    const tomorrowLabel = tomorrowDate.toLocaleDateString('en-US', dateOption);
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
        const date = new Date(booking.date).toLocaleDateString('en-US', dateOption);
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
                                                        <div className="flex flex-col items-center justify-center bg-gray-50 group-hover:bg-[#FEF200] rounded-xl w-20 h-20 transition-colors text-center">
                                                            <Clock size={16} className="text-gray-400 group-hover:text-[#ED1B24]" />
                                                            <span className="font-black text-lg text-gray-800">{app.time}</span>
                                                        </div>
                                                        
                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-900">{app.name}</h4>
                                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                                <Phone size={14} className="mr-2" /> {app.phone}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* --- ACTION BUTTONS --- */}
                                                    <div className="flex items-center space-x-2">
                                                        <button 
                                                            onClick={() => { setSelectedApp(app); setIsEditing(true); }}
                                                            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(app._id)}
                                                            className="p-3 text-gray-400 hover:text-[#ED1B24] hover:bg-red-50 rounded-xl transition-all"
                                                            title="Delete"
                                                        >
                                                            <svg size={18} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
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

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-popIn">
                        <div className="bg-[#FEF200] p-6 border-b-4 border-[#ED1B24]">
                            <h2 className="text-xl font-black italic text-[#ED1B24]">EDIT APPOINTMENT</h2>
                        </div>
                        
                        <form onSubmit={handleUpdate} className="p-8 space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400">Customer Name</label>
                                <input 
                                    type="text" 
                                    className="w-full border-b-2 border-gray-100 py-2 focus:border-[#ED1B24] outline-none font-bold"
                                    value={selectedApp.name}
                                    onChange={(e) => setSelectedApp({...selectedApp, name: e.target.value})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full border-b-2 border-gray-100 py-2 outline-none"
                                        value={selectedApp.date.split('T')[0]} // Formats for input
                                        onChange={(e) => setSelectedApp({...selectedApp, date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400">Time</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-b-2 border-gray-100 py-2 outline-none"
                                        value={selectedApp.time}
                                        onChange={(e) => setSelectedApp({...selectedApp, time: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 py-3 text-gray-400 font-bold hover:bg-gray-50 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-3 bg-[#ED1B24] text-white font-black rounded-xl hover:shadow-lg transition-all"
                                >
                                    SAVE CHANGES
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}