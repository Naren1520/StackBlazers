import crypto from 'crypto';

/**
 * Generate a unique EduID (Educational Identifier)
 * Format: CREDCHAIN-INSTITUTION-TIMESTAMP-RANDOM
 * Example: CREDCHAIN-MC5D-1708105200000-A3K9
 */
export const generateEduID = (institutionAddress) => {
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(2).toString('hex').toUpperCase();
  const institutionCode = institutionAddress.slice(2, 6).toUpperCase();

  return `CREDCHAIN-${institutionCode}-${timestamp}-${randomBytes}`;
};

/**
 * Validate EduID format
 */
export const validateEduID = (eduID) => {
  const eduIDRegex = /^CREDCHAIN-[A-Z0-9]{4}-\d{13}-[A-Z0-9]{4}$/;
  return eduIDRegex.test(eduID);
};

/**
 * Extract institution code from EduID
 */
export const extractInstitutionCode = (eduID) => {
  const parts = eduID.split('-');
  return parts[1]; // Returns institution code
};

/**
 * Extract timestamp from EduID
 */
export const extractTimestamp = (eduID) => {
  const parts = eduID.split('-');
  return parseInt(parts[2]); // Returns timestamp in milliseconds
};

/**
 * Format bytes32 hash to human-readable hex string
 */
export const formatHash = (hash) => {
  if (typeof hash === 'string') {
    return hash.length > 16 ? hash.slice(0, 16) + '...' : hash;
  }
  return 'N/A';
};

/**
 * Convert file to hex string for on-chain storage
 */
export const fileToHash = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const hex = Buffer.from(reader.result).toString('hex');
      resolve('0x' + hex);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generate hash from file content (SHA-256)
 */
export const generateFileHash = async (file) => {
  if (!file) return null;

  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return '0x' + hashHex;
};

/**
 * Generate mock hash for testing
 */
export const generateMockHash = (input) => {
  return '0x' + crypto.createHash('sha256').update(input).digest('hex');
};
