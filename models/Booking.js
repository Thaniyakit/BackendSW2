const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    startDate: {
        type: String,
        required:true
    },
    endDate: {
        type: String,
        required:true
    },
    user: {
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.ObjectId,
        ref: 'Car',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);