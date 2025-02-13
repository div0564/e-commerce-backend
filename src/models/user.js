const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type:String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
},{versionKey: false,timestamps: true });

const User = mongoose.model('User',userSchema);

module.exports = User;