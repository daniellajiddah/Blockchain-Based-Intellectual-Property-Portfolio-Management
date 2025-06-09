# Blockchain-Based Intellectual Property Portfolio Management

A comprehensive smart contract system for managing intellectual property portfolios on the blockchain, built with Clarity for the Stacks blockchain.

## Overview

This system provides a complete solution for IP portfolio management, including department verification, asset inventory, valuation management, strategy development, and competitive analysis.

## Features

### 🏢 IP Department Verification
- Register and verify IP departments
- Manage department credentials and status
- Administrative controls for verification

### 📋 Asset Inventory Management
- Add and categorize IP assets (patents, trademarks, copyrights)
- Track asset lifecycle and status
- Transfer asset ownership
- Comprehensive asset metadata storage

### 💰 Valuation Management
- Certified valuator system
- Multiple valuation methods support
- Historical valuation tracking
- Confidence level assessments

### 📈 Strategy Development
- Create and manage IP portfolio strategies
- Set objectives, timelines, and budgets
- Assign assets to strategies
- Milestone tracking

### 🔍 Competitive Analysis
- Market landscape analysis
- Competitor profiling
- Threat assessment
- Market trend tracking

## Smart Contracts

### 1. IP Department Verification (`ip-department-verification.clar`)
Manages the verification and registration of IP departments.

**Key Functions:**
- `register-department`: Register a new IP department
- `verify-department`: Verify a registered department (admin only)
- `is-verified-department`: Check if a department is verified

### 2. Asset Inventory (`asset-inventory.clar`)
Handles the inventory and management of IP assets.

**Key Functions:**
- `add-asset`: Add a new IP asset to inventory
- `update-asset-status`: Update asset status
- `transfer-asset`: Transfer asset ownership
- `get-asset`: Retrieve asset information

### 3. Valuation Management (`valuation-management.clar`)
Manages IP asset valuations and certified valuators.

**Key Functions:**
- `certify-valuator`: Certify a valuator (admin only)
- `create-valuation`: Create a new asset valuation
- `update-valuation`: Update existing valuation
- `get-valuation`: Retrieve valuation data

### 4. Strategy Development (`strategy-development.clar`)
Develops and tracks IP portfolio strategies.

**Key Functions:**
- `create-strategy`: Create a new portfolio strategy
- `assign-assets-to-strategy`: Assign assets to a strategy
- `add-milestone`: Add milestones to strategies
- `update-strategy-status`: Update strategy status

### 5. Competitive Analysis (`competitive-analysis.clar`)
Analyzes competitive landscape and market trends.

**Key Functions:**
- `create-analysis`: Create competitive analysis
- `add-competitor-profile`: Add competitor information
- `add-market-trend`: Track market trends
- `get-analysis`: Retrieve analysis data

## Getting Started

### Prerequisites
- Stacks blockchain development environment
- Clarity CLI tools
- Node.js and npm for testing

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd ip-portfolio-management
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run tests:
   \`\`\`bash
   npm test
   \`\`\`

### Deployment

Deploy contracts to Stacks blockchain:

\`\`\`bash
# Deploy to testnet
clarinet deploy --testnet

# Deploy to mainnet
clarinet deploy --mainnet
\`\`\`

## Usage Examples

### Registering an IP Department
\`\`\`clarity
(contract-call? .ip-department-verification register-department
"Acme Corp IP Department"
"contact@acme.com")
\`\`\`

### Adding an IP Asset
\`\`\`clarity
(contract-call? .asset-inventory add-asset
"Patent"
"Revolutionary Widget"
"A widget that changes everything"
"US123456789"
u20240101
u20440101
"United States")
\`\`\`

### Creating a Valuation
\`\`\`clarity
(contract-call? .valuation-management create-valuation
u1
u1000000
"USD"
"Cost Approach"
u85
"Based on development costs and market analysis")
\`\`\`

## Data Structures

### Asset Structure
- `owner`: Principal who owns the asset
- `asset-type`: Type of IP (Patent, Trademark, Copyright)
- `title`: Asset title
- `description`: Detailed description
- `registration-number`: Official registration number
- `filing-date`: Date of filing
- `expiry-date`: Expiration date
- `status`: Current status
- `jurisdiction`: Legal jurisdiction

### Valuation Structure
- `asset-id`: Reference to the asset
- `valuation-amount`: Monetary value
- `currency`: Currency denomination
- `valuation-date`: Date of valuation
- `valuation-method`: Method used for valuation
- `valuator`: Principal who performed valuation
- `confidence-level`: Confidence in the valuation (0-100)
- `notes`: Additional notes

## Security Features

- **Access Control**: Role-based permissions for different functions
- **Data Integrity**: Immutable blockchain storage
- **Verification System**: Multi-level verification for departments and valuators
- **Audit Trail**: Complete transaction history

## Testing

The project includes comprehensive tests using Vitest:

\`\`\`bash
# Run all tests
npm test

# Run specific test file
npm test -- asset-inventory.test.js

# Run tests in watch mode
npm run test:watch
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## Roadmap

- [ ] Integration with external IP databases
- [ ] Advanced analytics and reporting
- [ ] Mobile application interface
- [ ] Multi-chain support
- [ ] AI-powered valuation assistance

