# Merkle Airdrop Smart Contract

This project implements a Merkle tree-based airdrop system for ERC20 tokens using Solidity smart contracts and Hardhat for development and testing.

## Overview

The Merkle Airdrop system allows for efficient distribution of tokens to a large number of addresses while minimizing gas costs. It uses a Merkle tree to verify claim eligibility without storing all recipient addresses on-chain. Claimers must possess a Bored Ape Yacht Club NFT to be able to claim their tokens.

## Key Components

1. **MerkleAirdrop Contract**: The main smart contract for managing the airdrop.
2. **RoseToken Contract**: An ERC20 token used for the airdrop.
3. **Merkle Tree Generation**: Scripts to generate the Merkle tree from a list of addresses and amounts.
4. **Tests**: Comprehensive tests to ensure the correct functioning of the contracts.

## Smart Contracts

### MerkleAirdrop.sol

- Manages the airdrop process
- Verifies claims using Merkle proofs
- Requires claimants to own a BAYC NFT
- Allows the owner to update the Merkle root and withdraw remaining tokens

### RTK.sol (RoseToken)

- Simple ERC20 token implementation
- Used as the token for the airdrop

## Scripts

### merkle.ts

- Reads airdrop data from a CSV file
- Generates a Merkle tree
- Saves the tree and proofs to JSON files
- Provides a function to retrieve the airdrop list

## Tests

The `test/AirdropClaim.ts` file contains comprehensive tests for the MerkleAirdrop contract, including:

- Deployment checks
- Airdrop claiming functionality
- Balance verifications

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   ALCHEMY_MAINNET_API_KEY_URL=your_alchemy_api_key
   ```

## Usage

1. Compile contracts:
   ```
   npx hardhat compile
   ```
2. Run tests:
   ```
   npx hardhat test
   ```
3. Generate Merkle tree and proofs:
   ```
   npx hardhat run scripts/merkle.ts
   ```

## Deployment

To deploy the contracts to a network:

1. Update `hardhat.config.ts` with the desired network configuration
2. Run the deployment script (not provided in the current setup)

## Security Considerations

- The contract requires ownership of a BAYC NFT for claiming, which adds an additional layer of verification
- Only the contract owner can update the Merkle root and withdraw remaining tokens
- Ensure the CSV file with airdrop data is kept secure and not publicly accessible

## Dependencies

- OpenZeppelin Contracts
- OpenZeppelin Merkle Tree
- Hardhat and associated plugins
- csv-parser for reading airdrop data