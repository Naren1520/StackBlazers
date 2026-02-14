import { ethers } from 'ethers';
import {
  getProvider,
  getSigner,
  getContract,
  getReadOnlyContract,
  requestAccount,
  getCurrentAccount,
} from './web3Helper';
import ABI from './abi.json';
import contractAddresses from './contractAddress.json';

const NETWORK_ID = 'sepolia';
const CONTRACT_ADDRESS = contractAddresses[NETWORK_ID];

/**
 * Get provider instance
 * @returns {ethers.Provider} Ethers provider
 */
export const getProviderInstance = () => {
  try {
    return getProvider();
  } catch (error) {
    // Fallback for SSR
    return new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
    );
  }
};

/**
 * Get contract instance (read-only)
 * @returns {ethers.Contract} Contract instance
 */
export const getContractInstance = () => {
  return getReadOnlyContract(CONTRACT_ADDRESS, ABI);
};

/**
 * Get signer and contract instance for write operations
 * @returns {Promise<{signer: ethers.Signer, contract: ethers.Contract}>}
 */
export const getSignerAndContractInstance = async () => {
  const signer = await getSigner();
  const contract = await getContract(CONTRACT_ADDRESS, ABI);
  return { signer, contract };
};

/**
 * Connect to MetaMask and request account access
 * @returns {Promise<string>} Connected wallet address
 */
export const connectMetaMask = async () => {
  return await requestAccount();
};

/**
 * Get current connected account
 * @returns {Promise<string|null>} Current account or null
 */
export const getCurrentWallet = async () => {
  return await getCurrentAccount();
};

/**
 * Check if institution is whitelisted
 * @param {string} address - Institution address
 * @returns {Promise<boolean>}
 */
export const isInstitutionWhitelisted = async (address) => {
  const contract = getContractInstance();
  return await contract.whitelistedIssuers(address);
};

/**
 * Whitelist institution (admin only)
 * @param {string} institutionAddress - Address to whitelist
 * @param {string} institutionName - Name of institution
 * @returns {Promise<ethers.TransactionResponse>}
 */
export const whitelistInstitution = async (institutionAddress, institutionName) => {
  const { contract } = await getSignerAndContractInstance();
  return await contract.whitelistIssuer(institutionAddress, true, institutionName);
};

/**
 * Remove institution from whitelist (admin only)
 * @param {string} institutionAddress - Address to remove
 * @returns {Promise<ethers.TransactionResponse>}
 */
export const removeFromWhitelist = async (institutionAddress) => {
  const { contract } = await getSignerAndContractInstance();
  return await contract.whitelistIssuer(institutionAddress, false, '');
};

/**
 * Issue a credential
 * @param {Object} credentialData - Credential details
 * @returns {Promise<ethers.TransactionResponse>}
 */
export const issueCredential = async (credentialData) => {
  const { contract } = await getSignerAndContractInstance();
  const {
    studentWallet,
    studentName,
    institutionName,
    credentialType,
    courseOrProgram,
    pdfHash,
  } = credentialData;

  return await contract.issueCredential(
    studentWallet,
    studentName,
    institutionName,
    credentialType,
    courseOrProgram,
    pdfHash
  );
};

/**
 * Verify credential by EduID
 * @param {string} eduId - Education ID
 * @returns {Promise<{exists: boolean, credential: Object}>}
 */
export const verifyCredential = async (eduId) => {
  const contract = getContractInstance();
  const [exists, credential] = await contract.verifyCredential(eduId);
  return { exists, credential };
};

/**
 * Get credential details
 * @param {string} eduId - Education ID
 * @returns {Promise<Object>} Credential data
 */
export const getCredentialDetails = async (eduId) => {
  const contract = getContractInstance();
  return await contract.getCredentialDetails(eduId);
};

/**
 * Check if credential is valid
 * @param {string} eduId - Education ID
 * @returns {Promise<boolean>}
 */
export const isCredentialValid = async (eduId) => {
  const contract = getContractInstance();
  return await contract.isCredentialValid(eduId);
};

/**
 * Revoke a credential
 * @param {string} eduId - Education ID
 * @returns {Promise<ethers.TransactionResponse>}
 */
export const revokeCredential = async (eduId) => {
  const { contract } = await getSignerAndContractInstance();
  return await contract.revokeCredential(eduId);
};

/**
 * Get credentials for a student
 * @param {string} studentWallet - Student wallet address
 * @returns {Promise<string[]>} Array of EduIDs
 */
export const getStudentCredentials = async (studentWallet) => {
  const contract = getContractInstance();
  return await contract.getStudentCredentials(studentWallet);
};

/**
 * Get all credentials (admin only)
 * @returns {Promise<string[]>} Array of all EduIDs
 */
export const getAllCredentials = async () => {
  const contract = getContractInstance();
  return await contract.getAllCredentials();
};

/**
 * Get total credential count
 * @returns {Promise<number>}
 */
export const getCredentialCount = async () => {
  const contract = getContractInstance();
  const count = await contract.getCredentialCount();
  return Number(count);
};

/**
 * Check if address is admin
 * @param {string} address - Address to check
 * @returns {Promise<boolean>}
 */
export const isAdmin = async (address) => {
  const contract = getContractInstance();
  const owner = await contract.owner();
  return owner.toLowerCase() === address.toLowerCase();
};
