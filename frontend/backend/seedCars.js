const mongoose = require('mongoose');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vehicle_bidding';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding');

        // Create a dummy seller
        let seller = await User.findOne({ email: 'kerala.seller@example.com' });
        if (!seller) {
            seller = new User({
                name: 'Kerala Auto Dealership',
                email: 'kerala.seller@example.com',
                password: 'password123',
                mobile: '9876543210',
                role: 'seller'
            });
            await seller.save();
            console.log('Dummy seller created');
        }

        // Clear existing vehicles to avoid duplicates during re-seeding
        await Vehicle.deleteMany({});
        console.log('Existing vehicles cleared');

        const vehicles = [
            {
                seller: seller._id,
                brand: 'Toyota',
                model: 'Innova Crysta 2.4 ZX',
                year: 2021,
                price: 2450000,
                mileage: 45000,
                description: 'Well-maintained single owner Toyota Innova Crysta. Used mainly for family trips across Kerala. KL Registration.',
                category: 'SUV/MUV',
                location: 'Kochi, Kerala',
                images: ['uploads\\innova.png'],
                documents: { rc: 'Valid up to 2036', insurance: 'Comprehensive, valid till Nov 2026', puc: 'Valid up to May 2026' },
                violations: 'No pending traffic violations. Clean MVD record.',
                specs: '2.4L Diesel Engine, 150 bhp, 343 Nm torque, Automatic Transmission, 7 Seater, Leather Upholstery.',
                bodyType: 'SUV/MUV',
                fuelType: 'Diesel',
                transmission: 'Automatic',
                seatingCapacity: 7,
                color: 'White',
                engineCapacity: '2393 cc',
                safetyRating: 5,
                airbags: 7,
                power: '150 bhp',
                torque: '343 Nm',
                isVerified: true,
                biddingEnabled: true,
                negotiable: false
            },
            {
                seller: seller._id,
                brand: 'Hyundai',
                model: 'Creta SX(O)',
                year: 2022,
                price: 1780000,
                mileage: 22000,
                description: 'Flashy black Hyundai Creta. Excellent condition, non-accidental.',
                category: 'SUV',
                location: 'Alappuzha, Kerala',
                images: ['uploads\\creta.png'],
                documents: { rc: 'Valid up to 2037', insurance: 'Third-party, valid till Jan 2027', puc: 'Valid up to Aug 2026' },
                violations: '1 pending speeding ticket (₹1500 AI camera fine near Edappally).',
                specs: '1.5L CRDi Diesel Engine, 113 bhp, 250 Nm torque, 6-speed Manual, Panoramic Sunroof, Bose Sound System.',
                bodyType: 'SUV',
                fuelType: 'Diesel',
                transmission: 'Manual',
                seatingCapacity: 5,
                color: 'Black',
                engineCapacity: '1493 cc',
                safetyRating: 3,
                airbags: 6,
                power: '113 bhp',
                torque: '250 Nm',
                isVerified: true,
                biddingEnabled: false,
                negotiable: true
            },
            {
                seller: seller._id,
                brand: 'Maruti Suzuki',
                model: 'Swift ZXi Plus',
                year: 2019,
                price: 650000,
                mileage: 58000,
                description: 'Sporty red modified Swift. Custom alloys and skirts. Perfect for city driving. FIXED PRICE.',
                category: 'Hatchback',
                location: 'Thiruvananthapuram, Kerala',
                images: ['uploads\\swift.png'],
                documents: { rc: 'Valid up to 2034', insurance: 'Comprehensive, valid till Dec 2026', puc: 'Valid up to Oct 2026' },
                violations: 'Clear. Previous sun film challan cleared.',
                specs: '1.2L K Series Petrol Engine, 82 bhp, 113 Nm torque, 5-speed Manual, Custom 16-inch Alloys, Sports Exhaust.',
                bodyType: 'Hatchback',
                fuelType: 'Petrol',
                transmission: 'Manual',
                seatingCapacity: 5,
                color: 'Red',
                engineCapacity: '1197 cc',
                safetyRating: 2,
                airbags: 2,
                power: '82 bhp',
                torque: '113 Nm',
                isVerified: true,
                biddingEnabled: false,
                negotiable: false
            },
            {
                seller: seller._id,
                brand: 'Mahindra',
                model: 'Thar LX 4x4 Hard Top',
                year: 2023,
                price: 1650000,
                mileage: 12000,
                description: 'Almost brand new Mahindra Thar. Off-road ready. Looking for a quick sale, open purely to highest bidder!',
                category: 'SUV',
                location: 'Kozhikode, Kerala',
                images: ['uploads\\thar.png'], // Requires a thar.png or will fallback to No Image
                documents: { rc: 'Valid up to 2038', insurance: 'Comprehensive, valid till March 2027', puc: 'Valid up to Feb 2027' },
                violations: 'None.',
                specs: '2.0L mStallion Petrol, 150 bhp, Automatic, 4x4 with Low Range, Hard Top.',
                bodyType: 'SUV',
                fuelType: 'Petrol',
                transmission: 'Automatic',
                seatingCapacity: 4,
                color: 'Red',
                engineCapacity: '1997 cc',
                safetyRating: 4,
                airbags: 2,
                power: '150 bhp',
                torque: '300 Nm',
                isVerified: true,
                biddingEnabled: true,
                negotiable: false
            }
        ];

        for (const v of vehicles) {
            const newVehicle = new Vehicle(v);
            await newVehicle.save();
        }

        console.log('Successfully seeded Kerala demo cars (including Negotiable models)!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
