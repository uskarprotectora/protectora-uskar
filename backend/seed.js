const mongoose = require('mongoose');
require('dotenv').config();

const Pet = require('./models/Pet');

const samplePets = [
    {
        name: 'Max',
        type: 'dog',
        breed: 'Golden Retriever',
        birthDate: new Date('2022-03-15'),
        weight: 32,
        size: 'large',
        gender: 'male',
        neutered: true,
        vaccinated: true,
        chipped: true,
        description: 'Perro cariñoso y energético. Le encanta jugar y nadar. Genial con niños y otros perros.',
        photos: [],
        videos: [],
        sponsors: 5,
        status: 'active',
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    },
    {
        name: 'Luna',
        type: 'cat',
        breed: 'Gato Persa',
        birthDate: new Date('2023-01-20'),
        weight: 4.5,
        size: 'medium',
        gender: 'female',
        neutered: true,
        vaccinated: true,
        chipped: true,
        description: 'Preciosa gata persa con temperamento tranquilo. Requiere cepillado regular. Prefiere ambientes tranquilos.',
        photos: [],
        videos: [],
        sponsors: 3,
        status: 'active',
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    },
    {
        name: 'Bella',
        type: 'dog',
        breed: 'Labrador Retriever',
        birthDate: new Date('2020-06-10'),
        weight: 28,
        size: 'large',
        gender: 'female',
        neutered: true,
        vaccinated: true,
        chipped: true,
        description: 'Labrador gentil y cariñosa con excelente temperamento. Disfruta de paseos largos y nadar. Muy obediente.',
        photos: [],
        videos: [],
        sponsors: 8,
        status: 'active',
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    },
    {
        name: 'Oliver',
        type: 'cat',
        breed: 'Maine Coon',
        birthDate: new Date('2021-09-05'),
        weight: 7.2,
        size: 'large',
        gender: 'male',
        neutered: true,
        vaccinated: true,
        chipped: false,
        description: 'Gran Maine Coon con personalidad juguetona. Muy sociable y le encanta la atención. Se lleva bien con otras mascotas.',
        photos: [],
        videos: [],
        sponsors: 2,
        status: 'active',
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    },
    {
        name: 'Charlie',
        type: 'dog',
        breed: 'Beagle',
        birthDate: new Date('2019-04-22'),
        weight: 12,
        size: 'medium',
        gender: 'male',
        neutered: true,
        vaccinated: true,
        chipped: true,
        description: 'Beagle energético con naturaleza curiosa. Le encantan las aventuras de olores. Amigable con todos.',
        photos: [],
        videos: [],
        sponsors: 4,
        status: 'active',
        owner: {
            name: 'Protectora Uskar',
            email: 'info@protectorauskar.org',
            phone: ''
        }
    },
    {
        name: 'Mía',
        type: 'cat',
        breed: 'Gato Siamés',
        birthDate: new Date('2022-07-18'),
        weight: 3.8,
        size: 'small',
        gender: 'female',
        neutered: true,
        vaccinated: true,
        chipped: true,
        description: 'Siamesa vocal y cariñosa. Muy inteligente y le encanta jugar. Forma vínculos fuertes con su dueño.',
        photos: [],
        videos: [],
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
        breed: 'Pastor Alemán',
        birthDate: new Date('2021-02-14'),
        weight: 35,
        size: 'large',
        gender: 'male',
        neutered: true,
        vaccinated: true,
        chipped: true,
        description: 'Rocky encontró su hogar en enero de 2024. Ahora vive feliz con la familia Martínez y tiene un jardín enorme donde correr.',
        photos: [],
        videos: [],
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
        breed: 'Común Europeo',
        birthDate: new Date('2023-05-30'),
        weight: 3.5,
        size: 'small',
        gender: 'female',
        neutered: true,
        vaccinated: true,
        chipped: true,
        description: 'Nala fue adoptada en marzo de 2024. Su nueva familia la adora y ella disfruta de largas siestas al sol en su nuevo hogar.',
        photos: [],
        videos: [],
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
        console.log('NOTA: Los animales no tienen fotos. Añádelas desde el panel de administración.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
