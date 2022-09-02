const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },  
    watchList: [
        {
            movie: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Movie'
            },
            watched: Boolean
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = User = mongoose.model('User', schema);