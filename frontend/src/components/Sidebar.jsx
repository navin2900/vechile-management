import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Compass, LogOut, Sun, Moon, LogIn, UserPlus, Car, Settings as SettingsIcon } from 'lucide-react';

const Sidebar = ({ theme, toggleTheme }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.8rem 1rem',
        borderRadius: '8px',
        color: isActive(path) ? 'var(--primary)' : 'var(--text-secondary)',
        background: isActive(path) ? (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(79, 70, 229, 0.1)') : 'transparent',
        fontWeight: isActive(path) ? '600' : '500',
        transition: 'all 0.2s',
        marginBottom: '0.5rem',
        textDecoration: 'none'
    });

    return (
        <aside className="glass-panel" style={{
            width: '280px',
            height: 'calc(100vh - 2rem)',
            margin: '1rem',
            marginRight: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1.5rem',
            position: 'sticky',
            top: '1rem'
        }}>
            {/* Logo area */}
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <Link to="/" className="text-gradient" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <Car size={32} />
                    <span>AutoBid</span>
                </Link>
            </div>

            {/* User Profile Summary (if logged in) */}
            {user && (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fbcfe8 0%, #d8b4fe 100%)',
                        margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '2rem', color: '#4c1d95', fontWeight: 'bold' }}>
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{user.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'capitalize', marginTop: '0.2rem' }}>
                        {user.role}
                    </p>
                </div>
            )}

            {/* Navigation Links */}
            <nav style={{ flex: 1 }}>
                <Link to="/browse" style={navLinkStyle('/browse')}>
                    <Compass size={20} />
                    <span>Browse</span>
                </Link>

                {user ? (
                    <>
                        {user.role === 'admin' ? (
                            <Link to="/admin" style={navLinkStyle('/admin')}>
                                <LayoutDashboard size={20} />
                                <span>Admin Panel</span>
                            </Link>
                        ) : (
                            <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
                                <LayoutDashboard size={20} />
                                <span>Dashboard</span>
                            </Link>
                        )}
                        {user.role !== 'admin' && (
                            <Link to="/sell" style={navLinkStyle('/sell')}>
                                <Car size={20} />
                                <span>Sell Vehicle</span>
                            </Link>
                        )}
                        <Link to="/settings" style={navLinkStyle('/settings')}>
                            <SettingsIcon size={20} />
                            <span>Settings</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={navLinkStyle('/login')}>
                            <LogIn size={20} />
                            <span>Login</span>
                        </Link>
                        <Link to="/register" style={navLinkStyle('/register')}>
                            <UserPlus size={20} />
                            <span>Sign Up</span>
                        </Link>
                    </>
                )}
            </nav>

            {/* Action Buttons (Bottom) */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                    onClick={toggleTheme}
                    style={{ ...navLinkStyle('#'), background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    <span>Toggle Theme</span>
                </button>

                {user && (
                    <button
                        onClick={handleLogout}
                        style={{ ...navLinkStyle('#'), color: 'var(--error)', background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
