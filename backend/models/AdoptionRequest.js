const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
    // Datos del animal
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: false
    },
    petName: {
        type: String,
        trim: true
    },

    // Video de presentacion
    presentationVideo: {
        filename: String,
        url: String
    },

    // Datos personales del solicitante
    fullName: {
        type: String,
        required: [true, 'El nombre completo es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'El telefono es requerido'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'La edad es requerida'],
        min: 18
    },
    address: {
        type: String,
        required: [true, 'La direccion es requerida'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'La ciudad es requerida'],
        trim: true
    },

    // Situacion vivienda
    housingType: {
        type: String,
        enum: ['piso', 'casa', 'chalet', 'otro'],
        required: true
    },
    hasGarden: {
        type: Boolean,
        default: false
    },
    ownerOrRenter: {
        type: String,
        enum: ['propietario', 'alquiler'],
        required: true
    },
    landlordAllowsPets: {
        type: Boolean,
        default: true
    },

    // Situacion familiar
    familyMembers: {
        type: Number,
        required: true,
        min: 1
    },
    hasChildren: {
        type: Boolean,
        default: false
    },
    childrenAges: {
        type: String,
        trim: true
    },
    allAgree: {
        type: Boolean,
        required: true
    },

    // Experiencia con animales
    hasOtherPets: {
        type: Boolean,
        default: false
    },
    otherPetsDescription: {
        type: String,
        trim: true
    },
    previousPetExperience: {
        type: String,
        trim: true
    },

    // Sobre la adopcion
    whyAdopt: {
        type: String,
        required: [true, 'Por favor indica por que quieres adoptar'],
        trim: true
    },
    hoursAlone: {
        type: Number,
        required: true,
        min: 0,
        max: 24
    },
    vacationPlan: {
        type: String,
        trim: true
    },
    commitmentAware: {
        type: Boolean,
        required: true
    },

    // Estado de la solicitud
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'approved', 'rejected'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
