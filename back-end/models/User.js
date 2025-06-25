// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: String,
    mobile: String,
    otp: String,
    otpExpiresAt: Date,
    extraEvmAddress: String,
    extraEvmEncryptedPrivateKey: String,
    matchIdAddress: String,
    matchidToken: String,
    matchidDid: String,
    matchidAuthKey: String,
    needsMatchIdSetup: {
      type: Boolean,
      default: false,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
