const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    Id_nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Type: { type: String, required: true },
    fullName: { type: String },
    BirthDate: { type: Date, required: true },
    Date: { type: Date, required: true, default: Date.now },
    Locality: { type: String, required: true },
    Region: { type: String, required: true },
    VPO: { type: Boolean },
    declaration_parents: { type: String },
    declaration: { type: String }
});

module.exports = mongoose.model('Client', ClientSchema);