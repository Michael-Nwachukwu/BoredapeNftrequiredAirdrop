import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const merkleRoot = "0x427c68cc62d775ce40f9b7ec0a83bc0f69004ced1ff08c133b0806f65ec16446";
const tokenAddress = "0x9f3eB17a20a4E57Ed126F34061b0E40dF3a4f5C2";

const MerkleAirdropModule = buildModule("MerkleAirdropModule", (m) => {
  const token = m.getParameter("_tokenAddress", tokenAddress);
  const root = m.getParameter("_merkleRoot", merkleRoot);

  const airdrop = m.contract("MerkleAirdrop", [token, root]);

  return { airdrop };
});

export default MerkleAirdropModule;
