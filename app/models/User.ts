import mongoose from 'mongoose';
import { hashPassword, comparePasswords } from '../utils/auth';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lütfen isminizi girin'],
  },
  email: {
    type: String,
    required: [true, 'Lütfen email adresinizi girin'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli bir email adresi girin'],
  },
  password: {
    type: String,
    required: [true, 'Lütfen şifrenizi girin'],
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Şifreyi hashleme
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await comparePasswords(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema); 