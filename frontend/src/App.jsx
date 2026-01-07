import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

import './App.css'

import Splash from './pages/Splash';
import Home from './pages/Home';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Management from './pages/Management';
import Customer from './pages/Customer';
import Signup from './pages/Signup';
import Book from './pages/Book';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // Track logged-in user type (ie. 'admin' or 'customer')
  const [customerStatus, setCustomerStatus] = useState("guest"); // either guest or logged-in

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // Sync the status based on the recovered user data
      if (parsedUser.role === 'customer') {
        setCustomerStatus('customer');
      } else if (parsedUser.role === 'admin') {
        setCustomerStatus('admin');
      }
    }
  }, []);

  const handleLogin = () => {
    navigate('/login');
  }

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear storage
    setUser(null); // Reset state to show "Sign In" again
    setCustomerStatus('guest');
    navigate('/home');
  };

  return (
    <div className="appContainer">
      {/* 1. Header: Only shows if the URL is NOT the home page ('/') */}
      {location.pathname !== '/' && (
        <nav className="mainHeader">
          <div className="logo">
            <Link to="/" className="logoLink">
              <span className="logoMainText">Wendy's 名流髮廊</span>
              <span className="logoSubText">Hair Salon</span>
            </Link>
          </div>          
          <div className="navLinks">
            <Link to="/home">Home</Link>
            <Link to="/pricing">Pricing</Link>
            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link to="/booking">Book Here</Link>
                )}
                {/* Link to /management or /customer based on their role */}
                <Link to={user.role === 'admin' ? "/management" : "/customer"}>
                  {user.role === 'admin' ? "Admin Panel" : "My Profile"}
                </Link>
                <button onClick={handleLogout} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                    Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/booking">Book Here</Link>
                <button onClick={handleLogin} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                    Sign In
                </button>
              </>
            )}
          </div>
        </nav>
      )}

      {/* 2. Page Content: Changes based on URL */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home user={user}/>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login setUser={setUser} setCustomerStatus={setCustomerStatus}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/management" element={<Management />} />
        <Route path="/customer" element={<Customer user={user}/>} />
        <Route path="/booking" element={<Book user={user} customerStatus={customerStatus}/>} />
      </Routes>
    </div>
  );
}

export default App;