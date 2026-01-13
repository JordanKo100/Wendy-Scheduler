import { Calendar, Users } from "lucide-react";

export default function AdminSidebar({setPanel, panel}){
    return (
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
    )
}