const mongoose = require('mongoose');
const Schema = mongoose.Schema

const groupMemberSchema = new Schema ({
    groupID: {
        type: Schema.Types.ObjectID,
        ref: 'groups',
        require: true
    },
    member: {
        type: Schema.Types.ObjectID,
        ref: 'users',
    },
    role: {
        type: String,
        enum: ['Owner', 'Co-owner', 'Member']
    }
})

module.exports = mongoose.model('groupmembers', groupMemberSchema)