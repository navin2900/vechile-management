import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { CreditCard, Activity, Send, Car } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInbox = async () => {
            if (!user) return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/messages/inbox', config);
                setMessages(data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchInbox();
    }, [user]);

    if (!user) {
        return <div className="container" style={{ marginTop: '2rem' }}>Please log in to view your dashboard.</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '1400px' }}>
            <h1 className="text-gradient" style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Main Overview / "Cards" equivalent */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            borderRadius: '16px', padding: '1.5rem', flex: '1 1 300px', color: 'white',
                            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <span style={{ fontWeight: 'bold' }}>AutoBid Premium</span>
                                <CreditCard />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '4px' }}>**** **** **** 2847</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.8 }}>
                                <span>Card holder<br /><strong>{user.name}</strong></span>
                                <span>Exp date<br /><strong>06/25</strong></span>
                            </div>
                        </div>

                        <div style={{ flex: '1 1 200px' }}>
                            <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>$ 2850.75</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Current balance</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--success)' }}>$ 1500.50 Income</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--error)' }}>$ 350.60 Outcome</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages / Recent Activity */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={24} color="var(--primary)" />
                            Recent Messages
                        </h2>
                        {loading ? <p>Loading activity...</p> : messages.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No recent messages.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.slice(0, 4).map(msg => (
                                    <div key={msg._id} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                                {msg.sender.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{msg.sender._id === user._id ? `To: ${msg.receiver.name}` : `From: ${msg.sender.name}`}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {msg.vehicle ? `${msg.vehicle.brand} ${msg.vehicle.model}` : 'General Inquiry'}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Small Stat Card */}
                    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Profile Details</h3>
                        <div>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>{user.name}</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
                            <span style={{ display: 'inline-block', padding: '0.2rem 0.8rem', background: 'rgba(192, 132, 252, 0.2)', color: 'var(--primary)', borderRadius: '12px', fontSize: '0.8rem', marginTop: '0.5rem', textTransform: 'capitalize' }}>
                                {user.role}
                            </span>
                        </div>
                    </div>

                    {/* Quick Actions / "New Transaction" */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Quick Actions</h3>

                        {user.role === 'seller' ? (
                            <Link to="/sell" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                                <Car size={20} /> List New Vehicle
                            </Link>
                        ) : (
                            <Link to="/browse" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                                <Car size={20} /> Browse Vehicles
                            </Link>
                        )}

                        <button className="btn btn-outline" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                            <Send size={20} /> Send Message
                        </button>
                    </div>

                    {/* Progress Bars Placeholder */}
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Activity Stats</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <span>Bids Placed</span>
                                <span>52%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: '52%', height: '100%', background: '#f59e0b' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                <span>Vehicles Viewed</span>
                                <span>74%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: '74%', height: '100%', background: 'var(--primary)' }}></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
