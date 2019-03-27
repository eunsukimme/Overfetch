const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const errorSchema = new Schema({
    message: { type: String }
})

module.exports = mongoose.model('error', errorSchema);