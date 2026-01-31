const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Pet type is required'],
        enum: ['dog', 'cat'],
        lowercase: true
    },
    breed: {
        type: String,
        required: [true, 'Breed is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: 0
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: 0
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female'],
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    photos: [{
        filename: String,
        url: String,
        isMain: {
            type: Boolean,
            default: false
        }
    }],
    videos: [{
        filename: String,
        url: String
    }],
    sponsors: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'scheduled', 'inactive'],
        default: 'active'
    },
    owner: {
        name: {
            type: String,
            required: [true, 'Owner name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Owner email is required'],
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            trim: true
        },
        initials: {
            type: String,
            trim: true
        }
    }
}, {
    timestamps: true
});

petSchema.pre('save', function(next) {
    if (this.owner && this.owner.name && !this.owner.initials) {
        const nameParts = this.owner.name.split(' ');
        this.owner.initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2);
    }
    next();
});

module.exports = mongoose.model('Pet', petSchema);
