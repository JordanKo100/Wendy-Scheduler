import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import './App.css';
import { useAuth } from './context/AuthContext.jsx';
import { RequireAuth, RequireAdmin } from './components/RouteGuards.jsx';

import Splash from './pages/Splash';
import Home from './pages/Home';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import Management from './pages/Management';
import Customer from './pages/Customer';
import Signup from './pages/Signup';
import Book from './pages/Book';
import NotFound from './pages/NotFound';

export default function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Swal.fire({
            title: 'Logging Out?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#ED1B24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout!',
            cancelButtonText: 'Cancel',
            customClass: {
                title: 'font-black italic uppercase text-xl',
                popup: 'rounded-3xl border-4 border-[#FEF200]',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                await logout();
                navigate('/home');
            }
        });
    };

    return (
        <div className="appContainer">
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
                                {user.role === 'customer' && <Link to="/booking">Book Here</Link>}
                                <Link to={user.role === 'admin' ? '/management' : '/customer'}>
                                    {user.role === 'admin' ? 'Admin Panel' : 'My Profile'}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/booking">Book Here</Link>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                </nav>
            )}

            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Splash />} />
                <Route path="/home" element={<Home />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/booking" element={<Book />} />
                <Route
                    path="/customer"
                    element={
                        <RequireAuth>
                            <Customer />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/management"
                    element={
                        <RequireAdmin>
                            <Management />
                        </RequireAdmin>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}