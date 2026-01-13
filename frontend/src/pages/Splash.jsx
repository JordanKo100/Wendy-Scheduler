import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: -1000 }} 
      transition={{ duration: 0.8 }}
      // flex flex-col centers items vertically; h-screen fills the whole browser window
      className="flex flex-col items-center justify-center h-screen bg-[#FEF200] text-center px-4"
    >
      {/* Container for the logo text to give it weight */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black italic text-[#ED1B24] drop-shadow-md">
          Wendy's
        </h1>
        <p className="text-[#0078c4] font-bold uppercase tracking-[0.2em] mt-4 text-lg">
          Hair Salon
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Main Action Button */}
        <button 
          className="bg-[#ED1B24] hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
          onClick={() => navigate('/home')}
        >
          Book Now
        </button>

        {/* Subtle Admin Link */}
        <button 
          className="text-red-700 font-semibold hover:underline mt-4 text-sm opacity-80" 
          onClick={() => navigate('/login')}
        >
          Admin Login
        </button>
      </div>

      {/* Decorative Scissors/Comb icon placeholder area if you have icons */}
      <div className="absolute bottom-10 text-[#ED1B24] opacity-20 text-8xl pointer-events-none">
        ✂️
      </div>
    </motion.div>
  );
}