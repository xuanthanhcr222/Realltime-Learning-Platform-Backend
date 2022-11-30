const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userinfoSchema = new Schema ({
    name: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true,
        unique: true
    },
    dob: {
        type: Date,
        require: true
    },
    email: {
        type: String,
        default: false
    },
    address: {
        type: String
    },
    phone: {
        type: String
    }


})

module.exports = mongoose.model('userinfos', userinfoSchema)