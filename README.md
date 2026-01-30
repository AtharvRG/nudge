# Nudge - Private Solana Payment Links

Nudge is a privacy-focused payment platform that enables secure, shareable payment links on Solana using zero-knowledge proofs and stealth addresses. Users can receive payments to unlinkable addresses without revealing their main wallet identity on-chain, powered by Noir ZK circuits and Light Protocol compression.

## Overview

Nudge transforms Solana wallet payments into private transactions through a dual-layer privacy system. When someone pays via your shareable Blink URL, the payment is routed through Noir zero-knowledge proofs for identity verification and Light Protocol for on-chain compression, depositing funds into a cryptographically derived stealth address that has no traceable link to your main wallet.

## Key Features

### Core Privacy Features
- **Stealth Addresses**: Generate unlinkable payment addresses derived from your wallet signature using deterministic key derivation
- **Zero-Knowledge Proofs**: Noir-based circuits verify payment ownership without revealing sender or receiver identity
- **On-Chain Compression**: Light Protocol reduces transaction footprint while maintaining full security and verifiability
- **Non-Custodial**: Full control over your funds with recovery via viewing keys and wallet signature

### User Experience
- **Shareable Payment Links**: Create custom Blink URLs with memorable slugs for easy payment sharing
- **Link Management**: Create, edit, and delete payment links with granular control and labeling
- **Real-Time Dashboard**: Monitor received payments, active links, transaction history, and pool balances
- **Wallet Integration**: Works seamlessly with Phantom, Solflare, and other Solana wallets via Wallet Adapter
- **Tier System**: Free tier with link limits, Pro and Enterprise for power users

### Security & Compliance
- **Military-Grade Encryption**: ECDSA signatures with Solana's native cryptography standards
- **Transaction Verification**: All transactions verified on-chain with Noir proofs
- **Compliance Tools**: Export viewing keys for tax and audit purposes
- **No Private Key Custody**: Your keys remain in your wallet at all times

## Technology Stack

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS with Radix UI components
- **Animation**: Framer Motion for smooth UI transitions
- **Charts**: Recharts for transaction analytics
- **Icons**: Lucide React

### Backend & Blockchain
- **Solana Integration**: @solana/web3.js with Wallet Adapter
- **Privacy Proofs**: Noir ZK circuits via @noir-lang/noir_js
- **Compression**: Light Protocol stateless.js for transaction optimization
- **Database**: Supabase for link and transaction metadata
- **RPC**: Helius for optimized Solana devnet/mainnet connectivity

### Cryptography
- **ZK Framework**: Noir beta with Barretenberg backend
- **Key Derivation**: TweetNaCl for signature-based stealth address generation
- **Encoding**: Base58 for Solana address compatibility, BN.js for big number operations

## Project Structure

```
nudge/
├── app/
│   ├── page.tsx                 # Landing page with hero, features, how-it-works
│   ├── layout.tsx               # Root layout with providers
│   ├── globals.css              # Global styles and animations
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── page.tsx             # Main dashboard with stats and transactions
│   │   ├── links/               # Link management interface
│   │   ├── pool/                # Pool balance visualization
│   │   ├── profile/             # User settings and tier management
│   │   └── pricing/             # Tier comparison
│   └── api/
│       ├── actions/nudge/       # Solana Action/Blink endpoint
│       ├── light/               # Light Protocol RPC and compression proofs
│       ├── links/               # Link CRUD operations
│       └── payments/            # Payment confirmation and settlement
├── components/
│   ├── landing/                 # Hero, features, CTA sections
│   ├── dashboard/               # Dashboard cards and widgets
│   ├── app/                     # Auth dialogs, sidebar, navigation
│   └── ui/                      # Reusable Radix UI components
├── lib/
│   ├── light.ts                 # Light Protocol integration and compressed operations
│   ├── noir.ts                  # Noir ZK proof generation and verification
│   ├── stealth.ts               # Stealth address derivation utilities
│   ├── supabase.ts              # Database client and queries
│   ├── types.ts                 # TypeScript interfaces
│   └── utils.ts                 # Helper functions
├── contexts/
│   ├── auth-context.tsx         # Wallet auth and user state
│   └── user-context.tsx         # User profile and preferences
└── supabase/
    └── schema.sql               # Database schema for links and transactions
```

## How Nudge Works

### Payment Flow

1. **Link Creation**: User creates a payment link in dashboard, which generates a new stealth address via Noir proof
2. **Sharing**: User shares the Blink URL with custom slug (e.g., nudge?id=coffee-tips)
3. **Payment**: Payer clicks link, which initiates Solana Action with embedded transaction
4. **Compression**: Light Protocol compresses the transaction to reduce on-chain footprint
5. **Verification**: Noir ZK circuit verifies payment authenticity without revealing identities
6. **Settlement**: Funds arrive in stealth address, fully separated from payer's main wallet
7. **Withdrawal**: User withdraws to main wallet with full proof chain for compliance

### Stealth Address System

- **Derivation**: Each payment link generates a unique stealth address using ECDSA signature + deterministic path
- **Unlinkability**: No mathematical relationship between stealth address and main wallet public key
- **Recovery**: User can always recover stealth addresses using their main wallet signature as seed
- **Verification**: Noir circuit proves ownership without revealing the derivation path

### Zero-Knowledge Proofs

- **Privacy Circuit**: Verifies payment amounts and destinations without exposing actual values
- **Ownership Proof**: Proves control of stealth address without revealing the corresponding private key
- **Compliance**: Generates verifiable proofs that can be audited or shared with regulators

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Solana wallet (Phantom, Solflare, etc.)
- Supabase account for database (optional for development)

### Installation

```bash
# Clone repository
git clone https://github.com/AtharvRG/nudge.git
cd nudge

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and RPC URLs
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_HOST_URL=http://localhost:3000
HELIUS_API_KEY=your_helius_key
```

### Running Locally

```bash
# Development server
npm run dev

# Open http://localhost:3000
```

### Building for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## Features by Tier

### Free Tier
- 10 custom payment links
- Basic link analytics
- Standard dashboard
- Community support

### Pro Tier
- 50 custom payment links
- Advanced analytics and exports
- Priority support
- Batch operations

### Enterprise
- Unlimited payment links
- API access
- Dedicated support
- Custom integrations

## Database Schema

### Links Table
- `id`: UUID primary key
- `owner_id`: User's wallet public key
- `slug`: Custom URL path
- `stealth_public_key`: Generated stealth address for this link
- `title`: Link display name
- `is_active`: Whether link accepts payments
- `total_received`: Total SOL received via this link
- `created_at`: Creation timestamp

### Transactions Table
- `id`: UUID primary key
- `link_id`: Reference to payment link
- `amount`: SOL amount received
- `sender`: Payer's wallet (or "Unknown" if private)
- `signature`: Solana transaction signature
- `timestamp`: Transaction time
- `status`: pending/confirmed/failed
- `is_withdrawn`: Whether funds have been withdrawn

### Users Table
- `id`: UUID primary key
- `public_key`: Solana wallet address
- `display_name`: User's chosen name
- `pin_hash`: Hashed PIN for security
- `tier`: free/pro/enterprise subscription level
- `created_at`: Account creation time

## API Endpoints

### Links Management
- `GET /api/links?userId=<id>` - Fetch user's payment links
- `POST /api/links` - Create new payment link
- `PUT /api/links/[id]` - Update link details
- `DELETE /api/links/[id]` - Delete link

### Solana Actions (Blink)
- `GET /api/actions/nudge?id=<stealth_key>` - Blink transaction endpoint

### Light Protocol
- `POST /api/light/balance` - Get shielded account balance
- `POST /api/light/unshield-data` - Prepare unshielding transaction

### Payments
- `POST /api/payments/confirm` - Confirm and verify payment

## Security Considerations

### On-Chain Privacy
- Stealth addresses have no discernible link to main wallet on Solana blockchain
- Light Protocol compression removes intermediate state tree entries
- Noir proofs verify transactions without exposing plaintexts

### Off-Chain Security
- Wallet private keys never leave user's device
- Database stores only public data (addresses, metadata)
- Transaction signatures required for all operations
- All API endpoints validate wallet signatures

### Compliance & Auditability
- Viewing keys enable tax compliance without exposing full details
- Noir proofs can be publicly verified
- Transaction history is immutable on-chain
- Withdrawal proofs provide full audit trail

## Development Roadmap

### Current (MVP)
- Core stealth address generation
- Noir proof verification
- Light Protocol compression
- Blink URL sharing
- Basic dashboard

### Planned
- Multi-chain support (other privacy chains)
- Advanced analytics dashboard
- Batch withdrawal operations
- Webhook notifications
- API rate limiting and management
- Mobile application
- Hardware wallet support

## Testing

Currently uses Solana devnet. To test:

1. Get devnet SOL from faucet
2. Connect Phantom/Solflare wallet in development
3. Create a payment link
4. Share the Blink URL
5. Verify transactions appear in dashboard

## Contributing

Contributions welcome! Areas for improvement:
- Enhanced Noir circuit optimizations
- Alternative ZK backends
- Additional Solana compression methods
- UI/UX improvements
- Documentation and examples

## License

MIT License - see LICENSE file for details

## Support & Community

- GitHub Issues: Report bugs and feature requests
- Discussions: Community Q&A and ideas
- Documentation: Full technical docs at /docs

## Acknowledgments

Built during Solana hackathons with support from:
- Light Protocol team
- Noir / Aztec community
- Solana Ecosystem

## Authors

- **AtharvRG** - Core architecture, Light Protocol integration, Noir circuits
- **krishnagoyal099** - Dashboard UI, wallet integration, database design

---

**Status**: Active development on Solana devnet. Production deployment coming soon.

│  1. RECIPIENT                         2. SENDER                             │
│  ┌──────────────┐                     ┌──────────────┐                     │
│  │ Main Wallet  │                     │ Main Wallet  │                     │
│  │ (Hidden)     │                     │ (Visible)    │                     │
│  └──────┬───────┘                     └──────┬───────┘                     │
│         │                                    │                             │
│         │ Signs Message                      │ Clicks Blink URL            │
│         ▼                                    ▼                             │
│  ┌──────────────┐                     ┌──────────────┐                     │
│  │ Noir ZK      │                     │ Light        │                     │
│  │ Proof Gen    │                     │ Protocol     │                     │
│  └──────┬───────┘                     │ Compress     │                     │
│         │                             └──────┬───────┘                     │
│         ▼                                    │                             │
│  ┌──────────────┐◄───────────────────────────┘                             │
│  │ Stealth Key  │   Funds shielded to stealth addr                         │
│  │ Derived      │                                                          │
│  └──────┬───────┘                                                          │
│         │                                                                  │
│         │ Withdraw (Decompress + ZK Proof)                                 │
│         ▼                                                                  │
│  ┌──────────────┐                                                          │
│  │ Main Wallet  │ ← Funds appear without link to sender                    │
│  │ (Receives)   │                                                          │
│  └──────────────┘                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

1. **Noir ZK Proof**: When you unlock your identity, a Noir circuit generates a proof of ownership without revealing your wallet
2. **Stealth Key Derivation**: TweetNaCl derives a keypair from your signature — deterministic & reproducible
3. **Light Protocol Compression**: Incoming SOL is compressed into the Merkle tree, assigned to your stealth address
4. **Helius RPC**: Powers the prover service for real ZK validity proofs

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- A Solana wallet (Phantom, Solflare, or Backpack)
- Helius API key (free tier works)
- Supabase project (for database)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nudge.git
cd nudge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Configuration

Edit `.env.local`:

```env
# Helius RPC URL with ZK Compression support
NEXT_PUBLIC_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_HELIUS_API_KEY

# Your deployed URL (for Blink metadata)
NEXT_PUBLIC_HOST_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the schema in your Supabase SQL editor:

```bash
# Located at /supabase/schema.sql
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Project Structure

```
nudge/
├── app/
│   ├── api/
│   │   ├── actions/nudge/    # Solana Blinks API
│   │   └── links/            # Link management API
│   ├── dashboard/            # Protected dashboard routes
│   │   ├── page.tsx          # Main dashboard with stats
│   │   ├── links/            # Link management
│   │   ├── pricing/          # Subscription plans
│   │   └── settings/         # User settings
│   └── page.tsx              # Landing page
├── components/
│   ├── dashboard/
│   │   ├── link-manager.tsx  # CRUD for blinks
│   │   └── stats-overview.tsx # Analytics charts
│   ├── landing/
│   │   ├── hero.tsx          # Premium hero section
│   │   ├── features.tsx      # Feature showcase
│   │   ├── how-it-works.tsx  # Process explanation
│   │   └── cta.tsx           # Call to action
│   ├── layout/
│   │   ├── navbar.tsx        # Navigation
│   │   └── sidebar.tsx       # Dashboard sidebar
│   └── ui/                   # Reusable components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── progress.tsx
│       ├── tabs.tsx
│       └── tooltip.tsx
├── lib/
│   ├── light.ts              # Light Protocol integration
│   ├── noir.ts               # Noir ZK proof generation
│   ├── stealth.ts            # Stealth key derivation
│   ├── supabase.ts           # Database client
│   └── utils.ts              # Utilities
├── contexts/
│   └── user-context.tsx      # User state management
└── supabase/
    └── schema.sql            # Database schema
```

---

## 🔧 Core Technologies

| Technology | Purpose |
|------------|---------|
| **Noir** | ZK circuit language for identity proofs |
| **Light Protocol** | On-chain ZK compression |
| **Helius** | RPC + Prover service infrastructure |
| **Solana Actions** | Blink URL standard |
| **Next.js 16** | React framework with App Router |
| **Supabase** | PostgreSQL database + Auth |
| **Recharts** | Analytics visualization |
| **Framer Motion** | Premium animations |
| **Radix UI** | Accessible components |

---

## 📊 Dashboard Features

### Link Management
- **Create** up to 15 blinks (Free) / 50 (Pro) / 200 (Enterprise)
- **Custom Slugs** — name your links (e.g., `/coffee-tips`)
- **Edit** labels and slugs anytime
- **Delete** with failsafe (warns about pending balance)

### Analytics
- **Total Received** — sum of all payments
- **Click Tracking** — see link engagement
- **Conversion Rate** — clicks to payments ratio
- **Per-Link Stats** — detailed breakdown
- **Visual Charts** — beautiful data visualization

### Compliance
- **Export Reports** — JSON with stealth key ownership proof
- **Viewing Keys** — prove ownership for tax purposes
- **Privacy Preserved** — main wallet never exposed

---

## 🔐 Noir ZK Integration

```typescript
// lib/noir.ts - Privacy proof generation

import { generateOwnershipProof, generateTransferProof } from "./noir";

// Generate proof of stealth address ownership
const proof = await generateOwnershipProof(
    stealthSecretKey,
    stealthPublicKey,
    "Nudge Identity Verification"
);

// Generate privacy proof for transfers
const transferProof = await generateTransferProof(
    senderSecret,
    recipientStealth,
    amountLamports,
    nonce
);
```

The Noir integration provides:
- **Identity Proofs**: Prove you own a stealth address without revealing your main wallet
- **Transfer Proofs**: Verify payment validity without exposing sender information
- **Nullifiers**: Prevent double-spending with deterministic nullifier generation

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Environment Variables

```env
NEXT_PUBLIC_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY
NEXT_PUBLIC_HOST_URL=https://your-app.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

---

## ⚠️ Known Limitations

| Limitation | Details |
|------------|---------|
| **Proof Time** | ZK proofs can take 5-30 seconds |
| **Devnet Only** | Currently configured for Solana Devnet |
| **SOL Only** | SPL token support coming soon |
| **Blink Wallets** | Requires Phantom, Solflare, or Backpack |

---

## 🛣️ Roadmap

- [x] Noir ZK proof integration
- [x] Premium dashboard UI
- [x] Link management with custom slugs
- [x] Analytics visualization
- [ ] SPL Token support (USDC, etc.)
- [ ] Mainnet deployment
- [ ] Mobile app
- [ ] Recurring payments
- [ ] Multi-recipient splits

---

## 📄 License

MIT License - feel free to fork and build!

---

## 🙏 Acknowledgments

- [Noir Language](https://noir-lang.org/) - ZK circuit DSL
- [Light Protocol](https://lightprotocol.com/) - ZK Compression infrastructure
- [Helius](https://helius.dev/) - RPC + Prover service
- [Solana Actions](https://docs.dialect.to/) - Blink standard

---

<div align="center">

**Built with 🛡️ for privacy on Solana**

*Noir ZK • Light Protocol • Helius • Solana Actions*

</div>
