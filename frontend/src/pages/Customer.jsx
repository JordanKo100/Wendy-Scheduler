import { useState } from 'react';

export default function Customer({ onBack }){
    const [appointmentCount, setAppointmentCount] = useState(0);
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Customer Dashboard</h1>
            <p className="mb-8 text-neutral-400">Viewing Appointments Available for Today...</p>

            <button onClick={() =>setAppointmentCount(appointmentCount+1)}>Customer Count {appointmentCount}</button>
            <button onClick={onBack} className="mt-10 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition-all">
                Back Menu
            </button>
        </div>
    );
}