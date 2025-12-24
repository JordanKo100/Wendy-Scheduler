import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* 1. Splash Screen Section */}
      <AnimatePresence>
        {!showOptions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: -1000 }} // Slides up and out
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-center cursor-pointer"
            onClick={() => setShowOptions(true)}
          >
            <h1 className="text-6xl font-serif mb-4">Wendy's Hair Salon</h1>
            <p className="text-xl text-neutral-400">Click to enter</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Login Options Section */}
      {showOptions && (
        <motion.div 
          initial={{ y: 500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-md space-y-4 p-6"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Select Login Type</h2>
          
          <button className="w-full py-4 border-2 border-white hover:bg-white hover:text-black transition-all rounded-lg text-xl font-bold">
            Management Login
          </button>
          
          <button className="w-full py-4 border-2 border-white hover:bg-white hover:text-black transition-all rounded-lg text-xl font-bold">
            Customer Login
          </button>
          
          <button className="w-full py-4 bg-white text-black hover:bg-neutral-200 transition-all rounded-lg text-xl font-bold">
            Guest Login
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default App;