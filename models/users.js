const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema ({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    verified: {
        type: Boolean,
        default: false,
        require: true
    },
    refreshToken: {
        type: String
    }
})

module.exports = mongoose.model('users', userSchema)