const mongoose = require('mongoose');
const Schema = mongoose.Schema

const groupSchema = new Schema ({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        sparse: true
    },
    owner: {
        type: Schema.Types.ObjectID,
        ref: 'users',
        
    }
})

module.exports = mongoose.model('groups', groupSchema)