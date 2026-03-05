import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Filter, SortDesc, Tag } from 'lucide-react';

const Browse = () => {
    const [vehicles, setVehicles] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');

    // Comprehensive Filters State
    const [filters, setFilters] = useState({
        brand: 'all',
        bodyType: 'all',
        fuelType: 'all',
        transmission: 'all',
        seatingCapacity: 'all',
        color: 'all',
        budgetMin: '',
        budgetMax: '',
        mileageMax: '',
        safetyRatingMin: ''
    });

    // Control visibility of the "All Filters" Modal
    const [showFiltersModal, setShowFiltersModal] = useState(false);

    const fetchVehicles = async (searchQuery = '') => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:5000/api/vehicles?keyword=${searchQuery}`);
            setVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Stop Layout Jitter: Lock body scroll & prevent scrollbar page shifting when Modal opens
    useEffect(() => {
        if (showFiltersModal) {
            document.body.style.paddingRight = 'calc(100vw - 100%)';
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [showFiltersModal]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchVehicles(keyword);
    };

    // Apply local sorting/filtering for demo purposes
    let displayedVehicles = [...vehicles];

    // 1. Brand Filter
    if (filters.brand !== 'all') {
        displayedVehicles = displayedVehicles.filter(v => v.brand?.toLowerCase() === filters.brand.toLowerCase());
    }
    // 2. Body Type Filter
    if (filters.bodyType !== 'all') {
        displayedVehicles = displayedVehicles.filter(v => v.bodyType?.toLowerCase() === filters.bodyType.toLowerCase());
    }
    // 3. Fuel Type Filter
    if (filters.fuelType !== 'all') {
        displayedVehicles = displayedVehicles.filter(v => v.fuelType?.toLowerCase() === filters.fuelType.toLowerCase());
    }
    // 4. Transmission Filter
    if (filters.transmission !== 'all') {
        displayedVehicles = displayedVehicles.filter(v => v.transmission?.toLowerCase() === filters.transmission.toLowerCase());
    }
    // 5. Seating Capacity Filter
    if (filters.seatingCapacity !== 'all') {
        displayedVehicles = displayedVehicles.filter(v => v.seatingCapacity?.toString() === filters.seatingCapacity);
    }
    // 6. Color Filter
    if (filters.color !== 'all') {
        displayedVehicles = displayedVehicles.filter(v => v.color?.toLowerCase() === filters.color.toLowerCase());
    }
    // 7. Budget Min/Max Filter
    if (filters.budgetMin) {
        displayedVehicles = displayedVehicles.filter(v => v.price >= Number(filters.budgetMin));
    }
    if (filters.budgetMax) {
        displayedVehicles = displayedVehicles.filter(v => v.price <= Number(filters.budgetMax));
    }
    // 8. Mileage Max Filter
    if (filters.mileageMax) {
        displayedVehicles = displayedVehicles.filter(v => v.mileage <= Number(filters.mileageMax));
    }
    // 9. Safety Rating Min Filter
    if (filters.safetyRatingMin) {
        displayedVehicles = displayedVehicles.filter(v => (v.safetyRating || 0) >= Number(filters.safetyRatingMin));
    }

    // Sorting
    if (sortBy === 'price-low') {
        displayedVehicles.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        displayedVehicles.sort((a, b) => b.price - a.price);
    }

    const resetFilters = () => {
        setFilters({
            brand: 'all', bodyType: 'all', fuelType: 'all', transmission: 'all',
            seatingCapacity: 'all', color: 'all', budgetMin: '', budgetMax: '', mileageMax: '', safetyRatingMin: ''
        });
        setKeyword('');
        fetchVehicles('');
    };

    return (
        <div className="container animate-fade-in" style={{ marginTop: '1rem', maxWidth: '1400px' }}>

            {/* Top Search & Quick Filters Bar */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Search & Sort Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <form onSubmit={handleSearch} style={{ flex: '1 1 400px', display: 'flex', position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Search by keywords, specs, models..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            style={{ paddingLeft: '3rem', borderRadius: '8px 0 0 8px', borderRight: 'none', height: '50px', fontSize: '1rem' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0', padding: '0 2rem', height: '50px' }}>
                            Search
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <SortDesc size={18} color="var(--text-secondary)" />
                        <select className="input-field" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.6rem 1rem', minWidth: '150px' }}>
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Quick Filters Row (Matches Screenshot 1) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>

                    {/* Make/Brand */}
                    <div style={{ position: 'relative' }}>
                        <select className="input-field" value={filters.brand} onChange={e => setFilters({ ...filters, brand: e.target.value })} style={{ padding: '0.5rem 1rem', paddingLeft: '2.5rem', borderRadius: '20px', backgroundColor: filters.brand !== 'all' ? 'var(--surface)' : 'transparent', fontWeight: filters.brand !== 'all' ? 'bold' : 'normal' }}>
                            <option value="all">Make</option>
                            <option value="toyota">Toyota</option>
                            <option value="honda">Honda</option>
                            <option value="hyundai">Hyundai</option>
                            <option value="maruti suzuki">Maruti Suzuki</option>
                            <option value="mahindra">Mahindra</option>
                        </select>
                        <Tag size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary)' }} />
                    </div>

                    {/* Body Type */}
                    <div style={{ position: 'relative' }}>
                        <select className="input-field" value={filters.bodyType} onChange={e => setFilters({ ...filters, bodyType: e.target.value })} style={{ padding: '0.5rem 1rem', paddingLeft: '2.5rem', borderRadius: '20px', backgroundColor: filters.bodyType !== 'all' ? 'var(--surface)' : 'transparent', fontWeight: filters.bodyType !== 'all' ? 'bold' : 'normal' }}>
                            <option value="all">Body Type</option>
                            <option value="suv">SUV</option>
                            <option value="suv/muv">SUV / MUV</option>
                            <option value="sedan">Sedan</option>
                            <option value="hatchback">Hatchback</option>
                        </select>
                        <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>🚙</div>
                    </div>

                    {/* Fuel Type */}
                    <div style={{ position: 'relative' }}>
                        <select className="input-field" value={filters.fuelType} onChange={e => setFilters({ ...filters, fuelType: e.target.value })} style={{ padding: '0.5rem 1rem', paddingLeft: '2.5rem', borderRadius: '20px', backgroundColor: filters.fuelType !== 'all' ? 'var(--surface)' : 'transparent', fontWeight: filters.fuelType !== 'all' ? 'bold' : 'normal' }}>
                            <option value="all">Fuel Type</option>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="cng">CNG</option>
                        </select>
                        <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>⛽</div>
                    </div>

                    {/* Transmission */}
                    <div style={{ position: 'relative' }}>
                        <select className="input-field" value={filters.transmission} onChange={e => setFilters({ ...filters, transmission: e.target.value })} style={{ padding: '0.5rem 1rem', paddingLeft: '2.5rem', borderRadius: '20px', backgroundColor: filters.transmission !== 'all' ? 'var(--surface)' : 'transparent', fontWeight: filters.transmission !== 'all' ? 'bold' : 'normal' }}>
                            <option value="all">Transmission</option>
                            <option value="automatic">Automatic</option>
                            <option value="manual">Manual</option>
                        </select>
                        <div style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>🕹️</div>
                    </div>

                    {/* All Filters Button */}
                    <button
                        className="btn btn-outline"
                        onClick={() => setShowFiltersModal(true)}
                        style={{ padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', borderColor: 'var(--primary)', background: 'var(--surface)' }}
                    >
                        <Filter size={16} /> All Filters
                    </button>

                    {/* Clear Dropdown */}
                    {(filters.brand !== 'all' || filters.bodyType !== 'all' || filters.fuelType !== 'all' || filters.transmission !== 'all' || filters.budgetMax !== '' || filters.budgetMin !== '') && (
                        <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '0.9rem', marginLeft: '0.5rem', textDecoration: 'underline' }}>Clear All</button>
                    )}

                </div>
            </div>

            {/* Main Grid */}
            <main>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2>Available Vehicles</h2>
                    <span style={{ color: 'var(--text-secondary)' }}>Showing {displayedVehicles.length} results</span>
                </div>

                {loading ? (
                    <div>Loading vehicles...</div>
                ) : displayedVehicles.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                        <h3>No vehicles found</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Try adjusting your search criteria or resetting filters.</p>
                        <button onClick={resetFilters} className="btn btn-outline" style={{ marginTop: '1rem' }}>Clear Filters</button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {displayedVehicles.map(vehicle => (
                            <div key={vehicle._id} className="glass-panel vehicle-card hover-glow" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                                {/* Left Side Interactive Badges (Hover Filters) */}
                                <div className="vehicle-badges" style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10 }}>
                                    <div className="badge hover-badge" onClick={() => setFilters({ ...filters, brand: vehicle.brand })} title="Filter by Brand">
                                        <Tag size={12} /> {vehicle.brand}
                                    </div>
                                    <div className="badge hover-badge" onClick={() => setKeyword(vehicle.year.toString())} title="Filter by Year">
                                        <Filter size={12} /> {vehicle.year}
                                    </div>
                                </div>

                                <div style={{ height: '220px', background: 'var(--border)', position: 'relative' }}>
                                    {vehicle.images && vehicle.images.length > 0 ? (
                                        <img src={`http://localhost:5000/${vehicle.images[0].replace('\\', '/')}`} alt={vehicle.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                            No Image
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                                        ₹{vehicle.price.toLocaleString('en-IN')}
                                    </div>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>{vehicle.brand} {vehicle.model}</h3>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '4px' }}>{vehicle.mileage.toLocaleString()} km</span>
                                        <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '4px' }}>{vehicle.location}</span>
                                    </div>
                                    <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/vehicle/${vehicle._id}`} className="btn btn-primary" style={{ flex: 1 }}>View Details</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            {/* All Filters Modal (Matches Screenshots 2 & 3) */}
            {showFiltersModal && createPortal(
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="card animate-fade-in" style={{ width: '90%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto', padding: '0' }}>

                        {/* Modal Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-color)', zIndex: 10 }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Filter</h2>
                            <button onClick={() => setShowFiltersModal(false)} style={{ background: 'var(--border)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>X</button>
                        </div>

                        {/* Modal Body / Filter List */}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 'bold' }}>Make (Brand)</label>
                                <select className="input-field" value={filters.brand} onChange={e => setFilters({ ...filters, brand: e.target.value })}>
                                    <option value="all">Any Make</option>
                                    <option value="toyota">Toyota</option>
                                    <option value="honda">Honda</option>
                                    <option value="hyundai">Hyundai</option>
                                    <option value="maruti suzuki">Maruti Suzuki</option>
                                    <option value="mahindra">Mahindra</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 'bold' }}>Budget (Max ₹)</label>
                                <input type="number" className="input-field" placeholder="e.g. 500000" value={filters.budgetMax} onChange={e => setFilters({ ...filters, budgetMax: e.target.value })} />
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 'bold' }}>Body Type</label>
                                <select className="input-field" value={filters.bodyType} onChange={e => setFilters({ ...filters, bodyType: e.target.value })}>
                                    <option value="all">Any Body Type</option>
                                    <option value="suv">SUV</option>
                                    <option value="suv/muv">SUV / MUV</option>
                                    <option value="sedan">Sedan</option>
                                    <option value="hatchback">Hatchback</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 'bold' }}>Transmission Type</label>
                                <select className="input-field" value={filters.transmission} onChange={e => setFilters({ ...filters, transmission: e.target.value })}>
                                    <option value="all">Any Transmission</option>
                                    <option value="automatic">Automatic</option>
                                    <option value="manual">Manual</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 'bold' }}>Fuel Type</label>
                                <select className="input-field" value={filters.fuelType} onChange={e => setFilters({ ...filters, fuelType: e.target.value })}>
                                    <option value="all">Any Fuel Type</option>
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electric">Electric</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="cng">CNG</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 'bold' }}>Seating Capacity</label>
                                <select className="input-field" value={filters.seatingCapacity} onChange={e => setFilters({ ...filters, seatingCapacity: e.target.value })}>
                                    <option value="all">Any Capacity</option>
                                    <option value="2">2 Seater</option>
                                    <option value="4">4 Seater</option>
                                    <option value="5">5 Seater</option>
                                    <option value="7">7 Seater</option>
                                    <option value="8">8 Seater</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 'bold' }}>Mileage (Max km)</label>
                                <input type="number" className="input-field" placeholder="e.g. 50000" value={filters.mileageMax} onChange={e => setFilters({ ...filters, mileageMax: e.target.value })} />
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 'bold' }}>Safety Ratings (Min Stars)</label>
                                <select className="input-field" value={filters.safetyRatingMin} onChange={e => setFilters({ ...filters, safetyRatingMin: e.target.value })}>
                                    <option value="">Any Rating</option>
                                    <option value="1">1+ Stars</option>
                                    <option value="2">2+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="5">5 Stars Only</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label" style={{ fontWeight: 'bold' }}>Color</label>
                                <input type="text" className="input-field" placeholder="e.g. Red, Black, White" value={filters.color} onChange={e => setFilters({ ...filters, color: e.target.value })} />
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', position: 'sticky', bottom: 0, background: 'var(--bg-color)' }}>
                            <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Clear All</button>
                            <button onClick={() => setShowFiltersModal(false)} className="btn btn-primary" style={{ padding: '0.8rem 2rem', background: '#dc2626', borderColor: '#dc2626' }}>
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Browse;
