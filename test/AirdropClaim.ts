import { expect } from "chai";
import keccak256 from "keccak256";
import hre, { ethers } from "hardhat";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { getAirdropList } from "../scripts/merkle";
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");


describe("MerkleAirdrop", function () {

    // Function that deploys the ERC20 token.
    async function deployToken() {
    
        const roseToken = await hre.ethers.getContractFactory("RoseToken");
        const token = await roseToken.deploy();
        
        // return token deployment properties
        return { token };
    }

    // Function to deploy the Airdrop contract
    // async function deployContractI() {

    //     // Get users to populate airdropList
    //     const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    //     const airdropList = [
    //         [ addr1.address, ethers.parseEther("100") ],
    //         [ addr2.address, ethers.parseEther("200") ],
    //         [ addr3.address, ethers.parseEther("300") ],
    //     ];

    //     // Compute merkle tree for airdrop list
    //     const merkleTree = StandardMerkleTree.of(airdropList, ["address", "uint256"]);
    //     // get the the root hash of our merkletree
    //     const root = merkleTree.root;

    //     // Grab token from earlier deployment function 
    //     const { token } = await loadFixture(deployToken);

    //     // Grab desired contract to be deployed
    //     const airdropContract = await hre.ethers.getContractFactory("MerkleAirdrop");

    //     // Deploy contract
    //     const deployedAirdropContract = await airdropContract.deploy(token, root);

    //     await token.transfer(deployedAirdropContract, ethers.parseEther("1000"));

    //     return { deployedAirdropContract, token, owner, addr1, addr2, addr3, merkleTree };

    // }


    // Function to deploy the Airdrop contract
    async function deployContract() {
        // Get users to populate airdropList
        // const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

        const addr1 = "0x440Bcc7a1CF465EAFaBaE301D1D7739cbFe09dDA";
        const addr2 = "0x98E711f31E49C2e50C1A290b6F2b1e493E43EA76";
        const addr3 = "0x08c1AE7E46D4A13b766566033b5C47c735e19F6f";

        // Impersonate the holder address
        await helpers.impersonateAccount(addr1, addr2, addr3);

        // Set balance for each impersonated account
        await setBalance(addr1, ethers.parseEther("10"));
        await setBalance(addr2, ethers.parseEther("10"));
        await setBalance(addr3, ethers.parseEther("10"));

        // Make holder a signer to be able to sign transactions
        const impersonatedSigner1 = await ethers.getSigner(addr1);
        const impersonatedSigner2 = await ethers.getSigner(addr2);
        const impersonatedSigner3 = await ethers.getSigner(addr3);


        // Get airdrop list from CSV
        const csvAirdropList = await getAirdropList();
        
        // Convert amounts to BigInt and create airdropList
        const airdropList = csvAirdropList.map(([address, amount]) => [
            address,
            ethers.parseUnits(amount.toString(), 18)
        ]);

        // Compute merkle tree for airdrop list
        const merkleTree = StandardMerkleTree.of(airdropList, ["address", "uint256"]);
        // get the root hash of our merkletree
        const root = merkleTree.root;

        // Grab token from earlier deployment function 
        const { token } = await loadFixture(deployToken);

        // Grab desired contract to be deployed
        const airdropContract = await hre.ethers.getContractFactory("MerkleAirdrop");

        // Deploy contract
        const deployedAirdropContract = await airdropContract.deploy(token, root);

        await token.transfer(deployedAirdropContract, ethers.parseEther("10000"));

        return { deployedAirdropContract, token, impersonatedSigner1, impersonatedSigner2, impersonatedSigner3, merkleTree, airdropList };
    }

    describe("Deployment", function () {
        // This test checks that our airdrop contract was deployed with the correct address of our deployed token
        it("Should check if contract deploys with correct tokenAddress", async function () {
          const { token, deployedAirdropContract } = await loadFixture(deployContract);
          expect(await deployedAirdropContract.token()).to.equal(token);
        });

        it("Should check contract balance", async function () {
            const { token, deployedAirdropContract } = await loadFixture(deployContract);
            const expectedAmount = ethers.parseEther("10000");
            expect(await deployedAirdropContract.getContractBalance()).to.equal(expectedAmount);
          });
    });

    describe("Airdrop Claiming", function () {
        // This test lets an allowed user to claim their allowed amount
        it("Should allow eligible address to claim their airdrop", async function () {
            const { deployedAirdropContract, token, impersonatedSigner1, merkleTree } = await loadFixture(deployContract);

            // claim details - address and amount
            const claimingAddress = impersonatedSigner1.address;
            const claimAmount = ethers.parseEther("500");

            // Get proof of leaf
            const leaf = [claimingAddress, claimAmount];
            const proof = merkleTree.getProof(leaf);

            // Check that claim function emits the right event after claim
            await expect(deployedAirdropContract.connect(impersonatedSigner1).claim(claimAmount, proof))
                .to.emit(deployedAirdropContract, "AirdropClaimed")
                .withArgs(claimingAddress, claimAmount);
            
            // Check that claimer's balance equals claim amount
            expect(await token.balanceOf(claimingAddress)).to.equal(claimAmount);
        });

        
    });

    
});
