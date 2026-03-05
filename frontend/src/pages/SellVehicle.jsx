import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Upload, Car, DollarSign, FileText, CheckCircle } from 'lucide-react';

const SellVehicle = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: '',
        price: '',
        mileage: '',
        fuelType: 'Petrol',
        transmission: 'Manual',
        description: '',
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login first');

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/vehicles', formData, config);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || 'Error listing vehicle');
        }
        setLoading(false);
    };

    if (!user) {
        return <div className="container" style={{ marginTop: '2rem' }}>Please log in to list a vehicle.</div>;
    }

    if (user.role === 'admin') {
        return <div className="container" style={{ marginTop: '2rem' }}>Admins are not permitted to list vehicles for sale.</div>;
    }

    if (success) {
        return (
            <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
                    <CheckCircle size={60} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Success!</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Your vehicle has been listed and is pending admin verification.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
            <h1 className="text-gradient" style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Sell Your Vehicle</h1>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Brand</label>
                        <input
                            type="text" name="brand" value={formData.brand} onChange={handleChange} required
                            placeholder="e.g. BMW, Tesla"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Model</label>
                        <input
                            type="text" name="model" value={formData.model} onChange={handleChange} required
                            placeholder="e.g. Model 3, M4"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Year</label>
                        <input
                            type="number" name="year" value={formData.year} onChange={handleChange} required
                            placeholder="2023"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price ($)</label>
                        <input
                            type="number" name="price" value={formData.price} onChange={handleChange} required
                            placeholder="50000"
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
                    <textarea
                        name="description" value={formData.description} onChange={handleChange} required
                        placeholder="Describe your vehicle's condition, features, history..."
                        rows="4"
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                    ></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
                    {loading ? 'Processing...' : 'List Vehicle for Sale'}
                </button>
            </form>
        </div>
    );
};

export default SellVehicle;
