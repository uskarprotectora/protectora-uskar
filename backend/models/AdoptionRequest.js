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

    // Video de presentación
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
        required: [true, 'El teléfono es requerido'],
        trim: true
    },
    birthDate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es requerida']
    },
    profession: {
        type: String,
        required: [true, 'La profesión es requerida'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'La dirección es requerida'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'La ciudad es requerida'],
        trim: true
    },

    // Situación vivienda
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

    // Situación familiar (ahora es texto descriptivo)
    familyMembers: {
        type: String,
        required: [true, 'Indica los miembros de la familia'],
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

    // Sobre la adopción
    whyAdopt: {
        type: String,
        required: [true, 'Por favor indica por qué quieres adoptar'],
        trim: true
    },
    hoursAlone: {
        type: Number,
        required: true,
        min: 0,
        max: 24
    },
    commitmentAware: {
        type: Boolean,
        required: true
    },

    // Consentimientos legales
    dataProtectionConsent: {
        type: Boolean,
        required: [true, 'Debes aceptar la política de protección de datos'],
        default: false
    },
    followUpConsent: {
        type: Boolean,
        required: [true, 'Debes dar consentimiento para el seguimiento'],
        default: false
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
