import CryptoJS from 'crypto-js';

const ENCRYPTION_SECRET = import.meta.env.VITE_ENCRYPTION_SECRET || 'fitacts_super_secure_client_server_key_2026';

/**
 * Encrypt sensitive payload object before sending to auth APIs
 * to protect against Man-In-The-Middle (MITM) attacks.
 */
export const encryptAuthPayload = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_SECRET).toString();
    return { encryptedData };
  } catch (err) {
    console.warn('Encryption fallback to plain object:', err);
    return data;
  }
};
