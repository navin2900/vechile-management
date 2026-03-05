import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, LogOut, User, Menu, Car } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <Car size={24} />
                    <span>AutoBid</span>
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/browse" style={{ fontWeight: 500 }} className="nav-link">Browse</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/admin" style={{ fontWeight: 500 }} className="nav-link">Admin</Link>
                            ) : (
                                <Link to="/dashboard" style={{ fontWeight: 500 }} className="nav-link">Dashboard</Link>
                            )}
                            {user.role === 'seller' && (
                                <Link to="/sell" style={{ fontWeight: 500 }} className="nav-link">Sell Vehicle</Link>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hello, {user.name}</span>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', display: 'flex', gap: '0.4rem' }}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}

                    <button onClick={toggleTheme} className="btn" style={{ background: 'transparent', padding: '0.5rem', color: 'var(--text-primary)' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
