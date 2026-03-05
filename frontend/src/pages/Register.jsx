import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', mobile: '', password: '', role: 'user'
    });
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return "Please enter a valid email address.";
        }
        if (formData.password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (formData.mobile.length < 10) {
            return "Please enter a valid mobile number.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        const res = await register(formData.name, formData.email, formData.mobile, formData.password, formData.role);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create an Account</h2>
                {error && <div style={{ background: 'var(--error)', color: 'white', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', transition: 'all 0.3s ease' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Mobile Number</label>
                        <input type="text" name="mobile" className="input-field" value={formData.mobile} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input type="password" name="password" className="input-field" value={formData.password} onChange={handleChange} required minLength="6" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Login</Link>
                </p>
            </div >
        </div >
    );
};

export default Register;
