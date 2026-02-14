# CredChain - Blockchain Academic Credential Verification Platform

A decentralized application for issuing, verifying, and managing academic credentials on the Ethereum blockchain (Sepolia testnet).

##  Overview

CredChain is a blockchain-based credential verification system with three main roles:

- **Admin**: Whitelists institutions
- **Institutions**: Issue digital credentials
- **Students & Verifiers**: View/share and verify credentials

##  Project Structure

```
CredChain/
├── contracts/               # Smart contracts
│   ├── contracts/
│   │   └── CredentialRegistry.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── hardhat.config.js
│   └── package.json
├── frontend/               # Next.js application
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── page.jsx        # Landing page
│   │   ├── admin/          # Admin dashboard
│   │   ├── issuer/         # Issue credentials
│   │   ├── student/        # View credentials
│   │   └── verify/         # Verify credentials
│   ├── lib/
│   │   ├── web3Utils.js
│   │   ├── utils.js
│   │   ├── abi.json
│   │   └── contractAddress.json
│   ├── styles/
│   │   └── globals.css
│   └── package.json
└── README.md
```

##  Getting Started

### Prerequisites
- Node.js v18+
- MetaMask or compatible Ethereum wallet
- Sepolia testnet ETH for gas fees

### 1. Setup Contracts

```bash
cd contracts
npm install
```

Create `.env` file:
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
PRIVATE_KEY=your-wallet-private-key
ETHERSCAN_API_KEY=your-etherscan-key
```

Compile contracts:
```bash
npm run compile
```

Deploy to Sepolia:
```bash
npm run deploy
```

Update `frontend/lib/contractAddress.json` with deployed contract address.

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:3000`

##  Smart Contract (CredentialRegistry)

### Key Functions

#### Admin Functions
- `whitelistIssuer(address, bool, string)` - Manage institutions

#### Institution Functions
- `issueCredential(...)` - Issue credential (returns EduID)
- `revokeCredential(string)` - Revoke a credential

#### Public Functions
- `verifyCredential(string)` - Verify by EduID
- `getStudentCredentials(address)` - Get student's credentials
- `isCredentialValid(string)` - Check if valid

### Credential Struct
```solidity
struct Credential {
    string eduId;
    address issuer;
    address studentWallet;
    string studentName;
    string institutionName;
    string credentialType;
    string courseOrProgram;
    uint256 issueDate;
    bytes32 documentHash;
    bool revoked;
}
```

##  Frontend Pages

- `/` - Landing page with role overview
- `/admin` - Whitelist institutions, view all credentials
- `/issuer` - Issue credentials for students
- `/student` - View your credentials, share verification links
- `/verify` - Search and verify credentials by EduID
- `/verify/[eduId]` - Public credential verification page

##  Core Flow

1. **Admin** whitelists an institution address
2. **Institution** issues a credential with:
   - Student details
   - PDF certificate (stored on IPFS optional)
   - Document hash (stored on-chain)
3. System generates a unique **EduID** using keccak256
4. **Student** can view their credentials and share verification link
5. **Verifier** can enter EduID or scan QR to verify on `/verify/[eduId]`
6. **Admin/Institution** can revoke credentials if needed

##  Tech Stack

- **Blockchain**: Solidity ^0.8.20, Ethereum Sepolia
- **Smart Contracts**: Hardhat, ethers.js
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Web3**: ethers.js v6, MetaMask integration
- **File Hashing**: SHA-256 for PDFs

##  Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/...
```

### Contracts (`.env`)
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=...
```

##  Network Configuration

- **Network**: Sepolia Testnet
- **Chain ID**: 0xaa36a7 (11155111)
- **RPC**: https://sepolia.infura.io/v3/
- **Explorer**: https://sepolia.etherscan.io

##  Features

- Role-based access control (Admin, Issuer, Student, Verifier)
- Unique EduID generation (keccak256 based)
- PDF document hashing and verification
- Credential revocation
- Student credential tracking per wallet
- Public verification without wallet
- Shareable verification links
- MetaMask integration
- Responsive Tailwind UI
- Event logging for all transactions

##  Security

- Only contract owner can whitelist institutions
- Only whitelisted institutions can issue credentials
- Only issuer or owner can revoke credentials
- Document hashes stored on-chain for integrity
- Unique eduId prevents cloning
- All credentials linked to student wallet



## Contribution
- Naren S J
- narensonu1520@gmail.com