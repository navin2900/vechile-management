import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                color: 'white',
                padding: '5rem 2rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>Find Your Dream Vehicle</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        The most professional platform to buy, sell, and bid on verified vehicles.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/browse" className="btn" style={{ background: 'white', color: 'var(--primary)', padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                            Browse Vehicles
                        </Link>
                        <Link to="/register" className="btn btn-outline" style={{ borderColor: 'white', color: 'white', padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                            Start Selling
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container" style={{ padding: '4rem 1rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Why Choose AutoBid?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>
                            🚗
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Verified Listings</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>All vehicles and seller documents are verified by our admin team before going live.</p>
                    </div>

                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>
                            🔨
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Real-time Bidding</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Engage in exciting live auctions to get the best price for your desired vehicle.</p>
                    </div>

                    <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>
                            💬
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Direct Messaging</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Communicate securely with buyers and sellers directly through our platform.</p>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Home;
