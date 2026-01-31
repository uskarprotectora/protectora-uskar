const mongoose = require('mongoose');
require('dotenv').config();

const Pet = require('./models/Pet');

const samplePets = [
    {
        name: 'Max',
        type: 'dog',
        breed: 'Golden Retriever',
        age: 3,
        weight: 32,
        gender: 'male',
        description: 'Friendly and energetic golden retriever. Loves playing fetch and swimming. Great with children and other dogs. Currently on a training program.',
        photoCount: 12,
        videoCount: 3,
        sponsors: 5,
        status: 'active',
        owner: {
            name: 'Sarah Mitchell',
            email: 'sarah.m@email.com',
            phone: '+44 7700 900123'
        }
    },
    {
        name: 'Luna',
        type: 'cat',
        breed: 'Persian Cat',
        age: 2,
        weight: 4.5,
        gender: 'female',
        description: 'Beautiful Persian with a calm temperament. Requires regular grooming. Prefers quiet environments and loves lounging in sunny spots.',
        photoCount: 8,
        videoCount: 2,
        sponsors: 3,
        status: 'active',
        owner: {
            name: 'James Davidson',
            email: 'james.d@email.com',
            phone: '+44 7700 900456'
        }
    },
    {
        name: 'Bella',
        type: 'dog',
        breed: 'Labrador Retriever',
        age: 5,
        weight: 28,
        gender: 'female',
        description: 'Gentle and loving lab with excellent temperament. Trained therapy dog. Enjoys long walks and swimming. Very obedient and calm around children.',
        photoCount: 15,
        videoCount: 5,
        sponsors: 8,
        status: 'active',
        owner: {
            name: 'Emma Cooper',
            email: 'emma.c@email.com',
            phone: '+44 7700 900789'
        }
    },
    {
        name: 'Oliver',
        type: 'cat',
        breed: 'Maine Coon',
        age: 4,
        weight: 7.2,
        gender: 'male',
        description: 'Large and fluffy Maine Coon with a playful personality. Very social and loves attention. Gets along well with other pets and enjoys interactive toys.',
        photoCount: 10,
        videoCount: 4,
        sponsors: 2,
        status: 'scheduled',
        owner: {
            name: 'Liam Brown',
            email: 'liam.b@email.com',
            phone: '+44 7700 900321'
        }
    },
    {
        name: 'Charlie',
        type: 'dog',
        breed: 'Beagle',
        age: 6,
        weight: 12,
        gender: 'male',
        description: 'Energetic beagle with a curious nature. Loves sniffing adventures and following scent trails. Friendly with everyone and has a great appetite!',
        photoCount: 20,
        videoCount: 7,
        sponsors: 4,
        status: 'active',
        owner: {
            name: 'Olivia White',
            email: 'olivia.w@email.com',
            phone: '+44 7700 900654'
        }
    },
    {
        name: 'Mia',
        type: 'cat',
        breed: 'Siamese Cat',
        age: 3,
        weight: 3.8,
        gender: 'female',
        description: 'Vocal and affectionate Siamese. Very intelligent and loves interactive play. Forms strong bonds with her owner and follows them everywhere.',
        photoCount: 14,
        videoCount: 3,
        sponsors: 6,
        status: 'active',
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    },
    {
        name: 'Rocky',
        type: 'dog',
        breed: 'Pastor Aleman',
        age: 4,
        weight: 35,
        gender: 'male',
        description: 'Rocky encontro su hogar en enero de 2024. Ahora vive feliz con la familia Martinez y tiene un jardin enorme donde correr.',
        photoCount: 8,
        videoCount: 2,
        sponsors: 0,
        status: 'inactive',
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    },
    {
        name: 'Nala',
        type: 'cat',
        breed: 'Comun Europeo',
        age: 2,
        weight: 3.5,
        gender: 'female',
        description: 'Nala fue adoptada en marzo de 2024. Su nueva familia la adora y ella disfruta de largas siestas al sol en su nuevo hogar.',
        photoCount: 12,
        videoCount: 4,
        sponsors: 0,
        status: 'inactive',
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/petcustomer');
        console.log('Connected to MongoDB');

        // Clear existing data
        await Pet.deleteMany({});
        console.log('Cleared existing pets');

        // Insert sample data
        await Pet.insertMany(samplePets);
        console.log(`Inserted ${samplePets.length} sample pets`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
