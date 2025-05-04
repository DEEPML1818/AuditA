async function main() {
    const [deployer] = await ethers.getSigners();
    const AuditNFT = await ethers.getContractFactory("AuditNFT");
    const nft = await AuditNFT.deploy();
    await nft.deployed();
    console.log("AuditNFT deployed to:", nft.address);
  }
  main();
  