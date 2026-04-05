import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_encryption_key_123';

export const decryptPayload = (ciphertext: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('Malformed payload');
    }

    return JSON.parse(decryptedText);
  } catch (error) {
    throw new Error('Invalid or corrupted payload');
  }
};

export const encryptPayload = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};
