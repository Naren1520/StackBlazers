# CredChain - Blockchain Academic Credential Verification Platform

A decentralized application for issuing, verifying, and managing academic credentials on Ethereum. The repo includes Hardhat contracts and a Next.js frontend.

## Overview

CredChain is a blockchain-based credential verification system with three main roles:

- **Admin**: Whitelists institutions
- **Institutions**: Issue digital credentials
- **Students & Verifiers**: View/share and verify credentials

## Project Structure

```
StackBlazers/
├── contracts/               # Hardhat project
│   ├── contracts/
│   │   └── CredChain.sol
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
│   ├── components/
│   │   └── WalletConnect.jsx
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── web3Helper.ts
│   │   └── web3Utils.js
│   ├── styles/
│   │   └── globals.css
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v18+
- MetaMask or compatible Ethereum wallet
- Sepolia testnet ETH if deploying to Sepolia

### 1) Contracts (Hardhat)

```bash
cd contracts
npm install
```

Create `contracts/.env` for Sepolia deployments:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
PRIVATE_KEY=your-wallet-private-key
ETHERSCAN_API_KEY=your-etherscan-key
```

Compile:

```bash
npm run compile
```

#### Local chain (recommended for dev)

```bash
npm run node
```

In a new terminal:

```bash
npm run deploy:local
```

The deployment script saves info to `contracts/deployedAddress.json`.

#### Sepolia deployment

```bash
npm run deploy
```

### 2) Frontend (Next.js)

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Smart Contract (CredentialRegistry)

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

## Frontend Pages

- `/` - Landing page with role overview
- `/admin` - Whitelist institutions, view all credentials
- `/issuer` - Issue credentials for students (with PDF hash)
- `/student` - View your credentials, share verification links
- `/verify` - Search or scan QR to verify credentials by EduID
- `/verify/[eduId]` - Public credential verification page

## Core Flow

1. **Admin** whitelists an institution address
2. **Institution** issues a credential with:
   - Student details
   - PDF certificate hash (SHA-256 stored on-chain)
3. System generates a unique **EduID** using keccak256
4. **Student** can view their credentials and share verification link
5. **Verifier** can enter EduID or scan QR to verify on `/verify` or `/verify/[eduId]`
6. **Admin/Institution** can revoke credentials if needed

## Scripts

### Contracts

- `npm run compile` - Compile contracts
- `npm run test` - Run tests
- `npm run node` - Start Hardhat local node
- `npm run deploy:local` - Deploy to local node (31337)
- `npm run deploy` - Deploy to Sepolia

### Frontend

- `npm run dev` - Dev server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Lint

## Environment Variables

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
```

### Contracts (`contracts/.env`)

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
PRIVATE_KEY=0x...
ETHERSCAN_API_KEY=...
```

## Network Configuration

- **Local Hardhat**: 31337 (`http://127.0.0.1:8545`)
- **Sepolia Testnet**: 11155111 (`https://sepolia.infura.io/v3/`)

## Features

- Role-based access control (Admin, Issuer, Student, Verifier)
- Unique EduID generation (keccak256 based)
- PDF document hashing and verification (SHA-256)
- Credential revocation
- Student credential tracking per wallet
- Public verification without wallet
- Shareable verification links and QR support
- MetaMask integration
- Responsive Tailwind UI
- Event logging for all transactions

## Security Notes

- Only contract owner can whitelist institutions
- Only whitelisted institutions can issue credentials
- Only issuer or owner can revoke credentials
- Document hashes stored on-chain for integrity
- Unique EduID prevents cloning
- All credentials linked to student wallet

## Contribution

- Naren S J
- narensonu1520@gmail.com