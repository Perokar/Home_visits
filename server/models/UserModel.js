const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    region: { type: String, required: true },
    cpmsd: { type: String, required: true },
    ambulatoriya: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['медсестра', 'директор', 'перевіряючий', 'адміністратор'], default: 'медсестра' }
});

module.exports = mongoose.model('User', UserSchema);