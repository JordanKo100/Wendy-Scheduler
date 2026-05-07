import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Error 404</p>
                <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-[#ED1B24] mt-2">
                    PAGE NOT FOUND
                </h1>
                <p className="text-gray-500 mt-4 max-w-md mx-auto">
                    That link's been swept up off the salon floor. Let's get you back somewhere useful.
                </p>
                <Link
                    to="/home"
                    className="inline-block mt-8 px-10 py-4 bg-[#ED1B24] text-white font-black rounded-xl hover:bg-black transition uppercase italic tracking-wider"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}