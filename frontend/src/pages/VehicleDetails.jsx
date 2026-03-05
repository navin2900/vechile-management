import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Gavel, MessageSquare, AlertTriangle, ShieldCheck, X } from 'lucide-react';

const VehicleDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [vehicle, setVehicle] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
                setVehicle(data);

                const bidsRes = await axios.get(`http://localhost:5000/api/bids/${id}`);
                setBids(bidsRes.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            }
            setLoading(false);
        };

        fetchDetails();

        // Socket Setup
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.emit('join_vehicle_room', id);

        newSocket.on('new_bid', (newBid) => {
            setBids(prev => [newBid, ...prev]);
            setVehicle(prev => ({ ...prev, currentHighestBid: newBid.amount }));
        });

        newSocket.on('bidding_status_changed', (status) => {
            setVehicle(prev => ({ ...prev, biddingEnabled: status.biddingEnabled }));
        });

        return () => newSocket.close();
    }, [id]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!user) return setError('You must be logged in to bid.');

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/bids', { vehicleId: id, amount: Number(bidAmount) }, config);
            setBidAmount('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const [showChat, setShowChat] = useState(false);
    const [dummyMessages, setDummyMessages] = useState([
        { sender: 'seller', text: 'Hi! Are you interested in this vehicle?', time: '10:00 AM' }
    ]);
    const [chatInput, setChatInput] = useState('');

    const toggleChat = () => {
        setShowChat(!showChat);
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        // Add user message
        const newMsg = { sender: 'me', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setDummyMessages(prev => [...prev, newMsg]);
        setChatInput('');

        // Simulate seller reply
        setTimeout(() => {
            setDummyMessages(prev => [...prev, { sender: 'seller', text: 'Thanks for reaching out! I will get back to you shortly.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 1500);
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    if (!vehicle) return <div className="container" style={{ marginTop: '2rem' }}>Vehicle not found</div>;

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem', maxWidth: '1600px', marginBottom: '4rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 350px', gap: '2rem', alignItems: 'start' }}>

                {/* Left Side: Interactive Specs Box */}
                <aside>
                    <div className="glass-panel hover-glow" style={{ position: 'sticky', top: '2rem', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                        <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{vehicle.brand}</h2>
                        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{vehicle.model}</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '2rem' }}>{vehicle.year}</div>

                        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                            <div style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text-secondary)' }}>Category:</strong><br />{vehicle.category}</div>
                            <div style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--text-secondary)' }}>Mileage:</strong><br />{vehicle.mileage.toLocaleString()} km</div>
                            <div><strong style={{ color: 'var(--text-secondary)' }}>Location:</strong><br />{vehicle.location}</div>
                        </div>

                        {vehicle.specs && (
                            <div>
                                <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--text-primary)' }}>Full Specifications</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{vehicle.specs}</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Middle: Image and Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                        {vehicle.images && vehicle.images.length > 0 ? (
                            <img src={`http://localhost:5000/${vehicle.images[0].replace('\\', '/')}`} alt={vehicle.model} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '400px', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No Image</div>
                        )}
                    </div>

                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Vehicle Overview
                            {vehicle.isVerified && <ShieldCheck color="var(--success)" size={28} title="Verified by Admin" />}
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                            {vehicle.description}
                        </p>

                        {vehicle.violations && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)' }}>
                                    <AlertTriangle size={20} /> Violations/Issues
                                </h3>
                                <p style={{ color: 'var(--text-primary)' }}>{vehicle.violations}</p>
                            </div>
                        )}
                    </div>

                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Seller Information</h3>
                        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><strong>Name:</strong> {vehicle.seller.name}</p>
                        <button onClick={toggleChat} className="btn btn-outline" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={18} /> Direct Message
                        </button>
                    </div>
                </div>

                {/* Right Side: Sale Action System */}
                <aside>
                    <div className="glass-panel" style={{ position: 'sticky', top: '2rem', padding: '2rem' }}>
                        {vehicle.biddingEnabled ? (
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Gavel size={24} color="var(--primary)" /> Live Auction
                            </h2>
                        ) : (
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <ShieldCheck size={24} color="var(--primary)" /> Vehicle Sale
                            </h2>
                        )}

                        <div style={{ background: 'var(--surface)', padding: '2rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '2rem' }}>
                            {vehicle.biddingEnabled ? (
                                <>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '500' }}>Current Highest Bid</p>
                                    <div style={{ fontSize: '2.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        ₹{(vehicle.currentHighestBid || vehicle.price).toLocaleString('en-IN')}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                        Base Price: ₹{vehicle.price.toLocaleString('en-IN')}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '500' }}>Asking Price</p>
                                    <div style={{ fontSize: '2.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        ₹{vehicle.price.toLocaleString('en-IN')}
                                    </div>
                                    {vehicle.negotiable && (
                                        <p style={{ color: 'var(--success)', fontSize: '1rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                                            Open to Negotiation
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {vehicle.biddingEnabled ? (
                            <>
                                <form onSubmit={handleBidSubmit} style={{ marginBottom: '2rem' }}>
                                    {error && <div style={{ color: 'white', background: 'var(--error)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.95rem' }}>{error}</div>}
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="input-field"
                                            placeholder={`Min: ₹${((vehicle.currentHighestBid || vehicle.price) + 100).toLocaleString('en-IN')}`}
                                            value={bidAmount}
                                            onChange={e => setBidAmount(e.target.value)}
                                            required
                                            min={(vehicle.currentHighestBid || vehicle.price) + 1}
                                            style={{ fontSize: '1.1rem', padding: '1rem' }}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <Gavel size={20} /> Place Bid
                                    </button>
                                </form>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Bid History</h3>
                                {bids.length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center', padding: '2rem 0' }}>No bids yet. Be the first!</p>
                                ) : (
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                        {bids.map(bid => (
                                            <li key={bid._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}>
                                                <span>
                                                    <strong style={{ display: 'block', fontSize: '1.05rem', marginBottom: '0.2rem' }}>{bid.bidder.name}</strong>
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(bid.createdAt).toLocaleString()}</span>
                                                </span>
                                                <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>₹{bid.amount.toLocaleString('en-IN')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <button onClick={toggleChat} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <MessageSquare size={20} /> Contact Seller to Buy
                                </button>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This vehicle is listed at a fixed price. Reach out to the seller directly.</p>
                            </div>
                        )}
                    </div>
                </aside>

            </div>

            {/* Dummy Chat Box */}
            {showChat && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem', width: '350px',
                    background: 'var(--bg-color)', border: '1px solid var(--border)',
                    borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000
                }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={18} /> Chat with {vehicle.seller.name}
                        </h3>
                        <button onClick={toggleChat} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ padding: '1rem', height: '300px', overflowY: 'auto', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {dummyMessages.map((msg, idx) => (
                            <div key={idx} style={{ alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                <div style={{
                                    background: msg.sender === 'me' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    color: msg.sender === 'me' ? 'white' : 'var(--text-primary)',
                                    padding: '0.75rem 1rem', borderRadius: '12px',
                                    borderBottomRightRadius: msg.sender === 'me' ? 0 : '12px',
                                    borderBottomLeftRadius: msg.sender === 'seller' ? 0 : '12px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                    border: msg.sender !== 'me' ? '1px solid var(--border)' : 'none'
                                }}>
                                    {msg.text}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                                    {msg.time}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleChatSubmit} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', background: 'var(--bg-color)' }}>
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Type a message..."
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: '20px' }}>Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default VehicleDetails;
