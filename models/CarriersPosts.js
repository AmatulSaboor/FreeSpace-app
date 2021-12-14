const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarrierPostSchema = new Schema(
    {
        createdBy: {
            type: String,
        },
        departureDate: {
            type: Date,
            required: [true, 'departure date is required']
        },
        arrivalDate: {
            type: Date,
            required: [true, 'arrival date is required']
        },    
        departureCountry: {
            type: String,
            required: [true, 'origin country is required'],
        },
        departureCity: {
            type: String,
            required: [true, 'origin city is required'],
        },
        arrivalCountry: {
            type: String,
            required: [true, 'destination country is required'],
        },
        arrivalCity: {
            type: String,
            required: [true, 'destination city is required'],
        },
        weight: {
            type: Number,
            required: [true, 'weight is required']
        },
        volume: {
            type: String,
            required: [true, 'volume is required']
        },
        ratesPerKg: {
            type: String,
            required: [true, 'willing to pay is required']
        },
        comments: {
            type: String,
        }
    },
    { 
        timestamps: true,
        strict: false
    }
);

module.exports = mongoose.model('CarrierPost', CarrierPostSchema);
