# Bolt-NFT's | Next-Gen NFT Protocol on Stellar (Level 4 Submission)

A production-ready NFT marketplace built on the Stellar network using Soroban smart contracts. This project demonstrates advanced contract patterns, including atomic inter-contract calls for automated royalty distribution and real-time sales tracking.

## 🚀 Live Demo
- **Live Application**: [https://bolt-nft.vercel.app/](https://bolt-nft.vercel.app/)
- **Deployment Status**: [Vercel Deployment](https://bolt-nft.vercel.app/)

## 📊 CI/CD Status
![CI Status](https://github.com/akshy123-ctrl/bolt-nft/actions/workflows/ci.yml/badge.svg)

## 📱 Visual Preview

### Mobile Experience
<p align="center">
  <img src="hero_mobile.png" width="300" alt="Mobile Hero" />
</p>

### Product Demo
<p align="center">
  <img src="videos/demo.gif" width="100%" alt="Product Demo" />
</p>

### Creator Dashboard (Desktop)
![Creator Dashboard](dashboard.png)

## 🛠️ Advanced Features (Level 4 Focus)
- **Inter-Contract Calls**: The Marketplace contract atomically invokes the `RoyaltySplitter` contract during a purchase to distribute funds between the seller and the creator in a single, trustless transaction.
- **Custom NFT Asset**: Implements the `STARTNFT` contract (ERC-721 equivalent on Soroban) for high-fidelity digital assets.
- **Real-Time Event Streaming**: Utilizes Stellar Horizon SSE to provide live updates on sales and listings without page refreshes.
- **Production-Ready CI/CD**: Fully automated pipeline for smart contract testing and frontend deployment.

## 🧱 Technical Architecture
The diagram below illustrates the atomic flow of an inter-contract royalty payment:

```mermaid
graph TD
    Buyer[Buyer Wallet] -->|1. Buy NFT| Marketplace[Marketplace Contract]
    Marketplace -->|2. Split Payment| Splitter[RoyaltySplitter Contract]
    Splitter -->|3a. Transfer Royalty| Creator[Creator Account]
    Splitter -->|3b. Transfer Proceeds| Seller[Seller Account]
    Marketplace -->|4. Transfer NFT| Buyer
```

## ✅ Test Coverage & Verification

The core protocol is backed by a comprehensive suite of automated tests covering the entire NFT lifecycle and financial distribution logic.

### 🛡️ Smart Contract Security
| Scenario | Description | Status |
| :--- | :--- | :--- |
| **Atomic Royalty Splitting** | Verifies that payments are precisely divided between seller and creator in a single transaction. | `Passed` |
| **Inter-Contract Calls** | Ensures the Marketplace successfully invokes the Splitter contract for trustless distribution. | `Passed` |
| **NFT Asset Minting** | Validates ERC-721 equivalent minting logic and metadata integrity on Soroban. | `Passed` |
| **Authorization Guard** | Confirms `require_auth` prevents unauthorized listing/buying/delisting. | `Passed` |
| **Marketplace Lifecycle** | Tests listing, buying, and delisting edge cases (e.g., delisting after sale). | `Passed` |

### 🧪 Detailed Testing Guide
To verify the smart contract logic locally, follow these steps:

#### 1. Build the Contracts
Before testing, ensure all contracts are built to satisfy inter-contract dependencies:
```bash
# From the project root
cargo build --target wasm32-unknown-unknown --release
```

#### 2. Run Individual Contract Tests
Navigate into each contract directory to run its specific unit tests:

**Marketplace Testing:**
```bash
cd contracts/marketplace
cargo test
```

**Royalty Splitter Testing:**
```bash
cd contracts/royalty_splitter
cargo test
```

**NFT Asset Testing:**
```bash
cd contracts/start_nft
cargo test
```

#### 3. Workspace-Wide Testing
You can also run all tests from the project root:
```bash
cargo test
```

#### 4. Understanding the Test Logic
- **`marketplace/src/test.rs`**: Simulates the full NFT lifecycle (Mint -> List -> Buy -> Settle). It verifies that when a purchase occurs, the Marketplace atomically calls the Splitter contract, which then distributes XLM to both the Seller and the Creator correctly.

## 📜 Deployed Contracts (Testnet)
| Contract | Address |
| :--- | :--- |
| **Marketplace** | `CD5BIENAZHWBQMEQQEO7EUSXHWF6K6KDJI4DWHJGKLH6YZEPTV73K2IK` |
| **Royalty Splitter** | `CBGS3HWQ7JOH3MMLXY64ACEQHIY6XLD35EURXMTLILNCDURJBMAFV5ZA` |
| **STARTNFT Asset** | `CAUXXO22QIYDURZXHAHC3S7JQF654B35ZYMTLG64ASJUBACC4KH5CLOF` |
| **Native Token (XLM)** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |

## 🔗 Transaction Hashes & Identity
- **Marketplace Deployment**: `fb501ed7cb89a6e3c0e2f0e6e2a81c062b57c27da7fd61aad6dd90535688e08f`
- **Splitter Deployment**: `c29c6f64990929076721e172d5e0d5e76630c2dcb0ec0697658df50c227122bf`
- **STARTNFT Deployment**: `196255819e6ab6e8d1e00ba64b56eaefcebfa9f576c4216479de92f978f5c9aa`
- **Admin/Issuer Wallet**: `GBKNHIATMCYTFZZZUX347NF2SCH7MKMT7HS73HOVCC55CDJEI53I6S5A`

## 💻 Local Development

### Prerequisites
- Node.js 20+
- Stellar CLI (for contract testing)
- Freighter Wallet extension

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   Create a `.env.local` with your `MONGODB_URI`.
4. Run development server:
   ```bash
   npm run dev
   ```

## ✅ Submission Checklist
- [x] Public GitHub repository
- [x] README with complete documentation
- [x] 8+ meaningful commits (Current: 8)
- [x] Live demo link
- [x] Product demo video
- [x] Mobile responsive screenshot
- [x] CI/CD status badge
- [x] Contract addresses & hashes
- [x] Test Coverage Documentation
- [x] Inter-contract calls implementation
- [x] CI/CD Pipeline (Passing)
- [x] Verified build stability
