import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!user || user.role !== 'admin') return;
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/vehicles/admin', config);
                setVehicles(data);

                const resReports = await axios.get('http://localhost:5000/api/reports', config);
                setReports(resReports.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchAdminData();
    }, [user]);

    const verifyVehicle = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/vehicles/${id}/verify`, {}, config);
            setVehicles(vehicles.map(v => v._id === id ? { ...v, isVerified: true } : v));
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const toggleBidding = async (id, currentStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/bids/${id}/toggle-bidding`, {}, config);
            setVehicles(vehicles.map(v => v._id === id ? { ...v, biddingEnabled: data.biddingEnabled } : v));
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleAdminAction = async (id, action) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/vehicles/${id}/admin-action`, { action }, config);
            setVehicles(vehicles.map(v => v._id === id ? { ...v, isHidden: data.isHidden, isBlacklisted: data.isBlacklisted } : v));
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const deleteVehicle = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this vehicle?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/vehicles/${id}`, config);
            setVehicles(vehicles.filter(v => v._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    // Quick Edit Demo
    const promptQuickEdit = async (vehicle) => {
        const newPrice = window.prompt("Enter new price (currently " + vehicle.price + "):", vehicle.price);
        if (!newPrice || isNaN(newPrice)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`http://localhost:5000/api/vehicles/${vehicle._id}`, { price: Number(newPrice) }, config);
            setVehicles(vehicles.map(v => v._id === vehicle._id ? { ...v, price: data.price } : v));
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    if (!user || user.role !== 'admin') {
        return <div className="container" style={{ marginTop: '2rem' }}>Unauthorized. Admin access only.</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

            {reports && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Total Users</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{reports.users.total}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{reports.users.buyers} Buyers | {reports.users.sellers} Sellers</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Vehicles Listed</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{reports.vehicles.total}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{reports.vehicles.available} Available | {reports.vehicles.sold} Sold</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Pending Verification</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--error)' }}>{reports.vehicles.unverified}</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Total Bids</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{reports.bids.total}</div>
                    </div>
                </div>
            )}

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Listing Moderation & Bidding Control</h2>


                {loading ? <p>Loading...</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--bg-color)' }}>
                                    <th style={{ padding: '1rem' }}>Vehicle</th>
                                    <th style={{ padding: '1rem' }}>Seller</th>
                                    <th style={{ padding: '1rem' }}>Visibility / Status</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map(v => (
                                    <tr key={v._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <strong>{v.brand} {v.model} ({v.year})</strong><br />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Price: ${v.price}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{v.seller.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div>{v.isVerified ? <span style={{ color: 'var(--success)' }}>Verified</span> : <span style={{ color: 'var(--error)' }}>Pending</span>}</div>
                                            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                                {v.isBlacklisted ? (
                                                    <span style={{ color: 'var(--error)', fontWeight: 'bold' }}>BLACKLISTED</span>
                                                ) : v.isHidden ? (
                                                    <span style={{ color: 'var(--text-secondary)' }}>Hidden</span>
                                                ) : (
                                                    <span style={{ color: 'var(--success)' }}>Public</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {!v.isVerified && (
                                                <button onClick={() => verifyVehicle(v._id)} className="btn btn-outline" style={{ color: 'var(--success)', borderColor: 'var(--success)', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>Verify</button>
                                            )}

                                            <button onClick={() => promptQuickEdit(v)} className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>Edit Price</button>

                                            {v.isHidden && !v.isBlacklisted ? (
                                                <button onClick={() => handleAdminAction(v._id, 'unhide')} className="btn btn-outline" style={{ color: 'var(--success)', border: '1px solid var(--success)', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>Unhide</button>
                                            ) : (
                                                !v.isBlacklisted && <button onClick={() => handleAdminAction(v._id, 'hide')} className="btn btn-outline" style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>Hide</button>
                                            )}

                                            {v.isBlacklisted ? (
                                                <button onClick={() => handleAdminAction(v._id, 'unblacklist')} className="btn btn-outline" style={{ color: 'var(--success)', border: '1px solid var(--success)', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>Un-Blacklist</button>
                                            ) : (
                                                <button onClick={() => handleAdminAction(v._id, 'blacklist')} className="btn btn-outline" style={{ color: '#fb923c', border: '1px solid #fb923c', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>Blacklist</button>
                                            )}

                                            <button onClick={() => deleteVehicle(v._id)} className="btn btn-outline" style={{ color: 'var(--error)', border: '1px solid var(--error)', padding: '0.2rem 0.6rem', fontSize: '0.85rem' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {vehicles.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No vehicles found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
