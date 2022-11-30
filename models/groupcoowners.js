const mongoose = require('mongoose');
const Schema = mongoose.Schema

const groupCoownerSchema = new Schema ({
    groupID: {
        type: Schema.Types.ObjectID,
        ref: 'groups',
        require: true
    },
    coowner: {
        type: Schema.Types.ObjectID,
        ref: 'users',
    }
})

module.exports = mongoose.model('groupcoowners', groupCoownerSchema)