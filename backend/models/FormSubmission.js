const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
    // Tipo de formulario
    formType: {
        type: String,
        required: [true, 'El tipo de formulario es requerido'],
        enum: ['volunteer', 'foster', 'sponsorship', 'invoice_contribution', 'feedback']
    },

    // Datos comunes
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },

    // Datos específicos de voluntariado
    volunteerType: {
        type: String,
        enum: ['transporte', 'educador', 'refugio', 'fotografia', 'eventos', 'veterinario']
    },
    socialLink: {
        type: String,
        trim: true
    },
    availability: [{
        type: String
    }],
    transportDates: [{
        date: Date,
        start: Date, // Mantener para compatibilidad con datos antiguos
        end: Date,   // Mantener para compatibilidad con datos antiguos
        origin: String,
        destination: String
    }],

    // Datos específicos de casa de acogida
    housingType: {
        type: String,
        enum: ['piso', 'casa', 'chalet', 'finca']
    },
    outdoor: {
        type: String,
        enum: ['jardin', 'terraza', 'ambos', 'no']
    },
    otherPets: {
        type: String,
        trim: true
    },
    children: {
        type: String,
        trim: true
    },
    animalTypes: [{
        type: String
    }],
    duration: {
        type: String,
        enum: ['corto', 'medio', 'largo', 'flexible']
    },
    experience: {
        type: String,
        trim: true
    },
    comments: {
        type: String,
        trim: true
    },

    // Datos específicos de apadrinamiento
    animalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    },
    animalName: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        min: 0
    },
    wantsUpdates: {
        type: Boolean,
        default: true
    },

    // Datos específicos de contribución a factura
    invoiceId: {
        type: String
    },

    // Datos específicos de feedback/opinión
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    likes: {
        type: String,
        trim: true
    },
    improvements: {
        type: String,
        trim: true
    },

    // Consentimientos
    dataConsent: {
        type: Boolean,
        default: false
    },
    contactConsent: {
        type: Boolean,
        default: false
    },
    followUpConsent: {
        type: Boolean,
        default: false
    },

    // Estado de la solicitud
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);
