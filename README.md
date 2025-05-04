
<h1 align="center">AuditA</h1>

<p align="center"><strong>
🤖 AI-Powered Smart Contract Audits for 🧱 MoveVM & EVM  
Secured 🔐 On-Chain with 🧿 IOTA via 📦 IPFS  
</strong></p>

### 🚀 Live Simulator

Check out the live demo here: [🔗 AuditA Simulator](https:/xxxxxxxxxx.vercel.app/)

### 📄 IOTA and MoveVM+EVM Deployment (Testnet)

- **IOTA NFT Minter Contract Address (Testnet):** [`0xd6085f6cfd75439a23f812e10a994abc199fdeaa3b23789e6258abc09304c3a7`](https://explorer.rebased.iota.org/object/0xd6085f6cfd75439a23f812e10a994abc199fdeaa3b23789e6258abc09304c3a7?network=testnet)
  - **Deployer Address for NFT Minter (Testnet):** [`0x1569b1af6264a324dab0b0d1d8d6c5b87fda29f9c44c600a23cf6d6f432b7ab3`](https://explorer.rebased.iota.org/address/0x1569b1af6264a324dab0b0d1d8d6c5b87fda29f9c44c600a23cf6d6f432b7ab3?network=testnet)
  
- **MoveVM+EVM Contract Address (Testnet):** [`0x568259a43C1c435911E3bA48efAD66f290404FFf`](https://explorer.evm.testnet.iotaledger.net/address/0x568259a43C1c435911E3bA48efAD66f290404FFf)
  - **Deployer Address for MoveVM+EVM (Testnet):** [`0x952595fEd99dE1F36F19823f609aB7ac59bECa05`](https://explorer.evm.testnet.iotaledger.net/address/0x952595fEd99dE1F36F19823f609aB7ac59bECa05)

## 🧠 Architecture Overview

- **User** sends code to **Frontend**  
- **Frontend** calls the **AI Agent** _and_ directly writes to **IPFS**  
- **AI Agent** sends analysis to a **Server**, which generates the **PDF Report**  
- **PDF Report** is uploaded to **IPFS**  
- **IPFS** then feeds into the **IOTA NFT Mint**  
- Finally, the **MoveVM** bridges the proof‑NFT out to any **EVM Chain** and back  

---

- **Frontend**: Built with `Tailwind CSS`, `Radix UI`, `Vite`
- **AI Engine**: Uses `OpenAI API` for LLM-based code analysis (pluggable)
- **Storage**: Generates PDF reports → uploads to `IPFS` (via Pinata)
- **Proof**: Mints IOTA NFTs containing audit metadata and IPFS hash
- **Cross-chain Access**: MoveVM enables EVM ↔ IOTA communication
- **Wallets Supported**: `DappKit` (IOTA), `Web3-Wagmi` (EVM)

---

## ⚙️ Core Functions

| Module             | Description |
|--------------------|-------------|
| `analyzeCode()`    | Sends Move code to AI for audit |
| `generatePDF()`    | Converts audit results into styled PDF |
| `uploadToIPFS()`   | Uploads generated PDF via Pinata API |
| `mintAuditNFT()`   | Mints NFT on IOTA with audit metadata |
| `movevmBridge()` | Facilitates cross-chain access & token payments |
| `connectWallet()`  | Initializes wallet connection (IOTA or EVM) |

---

## 🚀 Installation & Local Setup

### 1. Clone the Repo

```bash
git clone https://github.com/DEEPML1818/AuditA.git
cd AuditA
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create .env File

```bash
NEXT_PUBLIC_OPENAI_KEY=       # your OpenAI secret key
NEXT_PUBLIC_PINATA_API_KEY=          # your Pinata api key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=      # your Pinata secret key
NEXT_PUBLIC_PACKAGE_ID=0x…         # your deployed Move package ID
```

### 4. Run Locally

```bash
npm run dev
# or
yarn dev
```
**Visit:** <http://localhost:3000>

### 🛠 Dependencies
- Vite
- OpenAI API
- Pinata IPFS
- IOTA SDK / DappKit
- MoveVM+EVM
- React-PDF
- Web3-React


### 🧪 Coming Soon
- Multi-agent AI audit consensus (voting mechanism)
- Public explorer for verified audits
- Tokenized credit system for audits
- Plugin system for third-party LLMs and chains

### 🤝 Contributing
PRs and issues are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### 🔐 License
MIT License © 2025 AuditA Contributors


