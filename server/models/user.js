const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String, 
    tag: String,
    quickplay: {
        test: String
    },
    rank: {
        test: String
    }
});

module.exports = mongoose.model('user', userSchema);