require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/job');
const Accommodation = require('./models/accommodation');
const Community = require('./models/community');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Clearing and seeding data...');

        await Job.deleteMany({});
        await Accommodation.deleteMany({});
        await Community.deleteMany({});

        await Job.create([
            { title: 'Barista - Part Time', company: 'Costa Coffee', location: 'Marylebone', type: 'Part-time', salary: '£11.50/hr', description: 'Flexible Hours', applyUrl: '#' },
            { title: 'Retail Assistant', company: 'Zara', location: 'Oxford Street', type: 'Part-time', salary: '£11.00/hr', description: 'Flexible Hours', applyUrl: '#' }
        ]);

        await Accommodation.create([
            { title: 'Marylebone Student Village', address: 'Marylebone, Westminster', type: 'En-suite', price: 280, description: 'Bills Included', distanceFromCampus: '2 min walk' },
            { title: 'The Arcade', address: 'Camden, London', type: 'Studio', price: 320, description: 'Study Spaces', distanceFromCampus: '15 min commute' }
        ]);

        await Community.create([
            { name: 'Football Society', category: 'Sports', description: 'Join our weekly training sessions!' },
            { name: 'Computer Science Society', category: 'Academic', description: 'Connect with fellow CS students.' }
        ]);

        console.log('✅ Flow Data Ready!');
        process.exit();
    } catch (err) { console.error(err); process.exit(1); }
};
seedData();