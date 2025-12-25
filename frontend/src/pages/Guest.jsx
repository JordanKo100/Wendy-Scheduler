export default function Guest({ onBack }){
    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Guest Dashboard</h1>
            <p className="mb-8 text-neutral-400">Viewing Appointments Available for Today...</p>

            <button onClick={onBack} className="mt-10 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition-all">
                Back Menu
            </button>
        </div>
    );
}