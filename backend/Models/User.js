const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, "L'email est requis"],
    trim: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Format d'email invalide"]
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  number: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis']
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    console.log('Hashing password...');
    this.password = await bcrypt.hash(this.password, 10);
    console.log('Password hashed successfully');
  }
  next();
});

module.exports = mongoose.model('User', userSchema);