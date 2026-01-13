import { Calendar } from "lucide-react";

export default function NoAppointmentBox(){
    return (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No appointments scheduled yet.</p>
        </div>
    )
}