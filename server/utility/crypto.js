import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
dotenv.config();

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'fitacts_super_secure_client_server_key_2026';

/**
 * Decrypts a payload encrypted by CryptoJS.AES on client.
 * If payload is already an object or plain text, returns as-is.
 */
export const decryptPayload = (payload) => {
  if (!payload) return payload;

  // If payload is wrapped in an object like { encryptedData: "..." }
  const cipherText = typeof payload === 'object' && payload.encryptedData
    ? payload.encryptedData
    : (typeof payload === 'string' ? payload : null);

  if (!cipherText) {
    return payload;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_SECRET);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) {
      // If decryption yielded empty string, return original payload
      return payload;
    }
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (err) {
    console.warn('Payload decryption skipped or failed, using original data:', err.message);
    return payload;
  }
};

/**
 * Encrypts data to send to client or across services
 */
export const encryptPayload = (data) => {
  const text = typeof data === 'object' ? JSON.stringify(data) : String(data);
  return CryptoJS.AES.encrypt(text, ENCRYPTION_SECRET).toString();
};
