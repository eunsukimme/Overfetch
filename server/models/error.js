const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const errorSchema = new Schema({
    name: { type: String },
    tag: { type: String },
    message: { type: String }
})

module.exports = mongoose.model('error', errorSchema);