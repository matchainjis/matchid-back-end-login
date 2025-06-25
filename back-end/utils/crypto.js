// utils/crypto.js
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'supersecretkey';

export const encryptPrivateKey = (privateKey) => {
    return CryptoJS.AES.encrypt(privateKey, ENCRYPTION_KEY).toString();
};

export const decryptPrivateKey = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};
