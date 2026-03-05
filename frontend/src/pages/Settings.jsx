import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera, Save, User as UserIcon, Mail } from 'lucide-react';

const Settings = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: user ? user.name : '',
        email: user ? user.email : ''
    });
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send an API request to update the user profile
        setMessage('Profile updated successfully! (Demo mode)');
        setTimeout(() => setMessage(null), 3000);
    };

    const handleImageUpload = (e) => {
        // Mock image upload interaction
        setMessage('Profile picture updated! (Demo mode)');
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px', marginTop: '2rem' }}>
            <h1 className="text-gradient" style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Account Settings</h1>

            {message && (
                <div style={{ background: 'var(--success)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>

                {/* Profile Picture Section */}
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #d8b4fe 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', overflow: 'hidden', marginBottom: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                        {user ? (
                            <span style={{ fontSize: '3rem', color: 'white', fontWeight: 'bold' }}>
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            <UserIcon size={48} color="white" />
                        )}

                        <label style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'rgba(0,0,0,0.5)', padding: '0.5rem', cursor: 'pointer',
                            display: 'flex', justifyContent: 'center', transition: 'background 0.2s'
                        }} className="hover-glow">
                            <Camera size={20} color="white" />
                            <input type="file" style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" />
                        </label>
                    </div>
                    <h3 style={{ margin: 0 }}>{user ? user.name : 'User'}</h3>
                    <p style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: '0.2rem' }}>
                        {user ? user.role : 'Guest'} Account
                    </p>
                </div>

                {/* Profile Details Section */}
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserIcon size={24} color="var(--primary)" /> Profile Details
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="input-field"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group" style={{ marginTop: '1.5rem' }}>
                            <label className="input-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="input-field"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Save size={18} /> Save Changes
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Settings;
