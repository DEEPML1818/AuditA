// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuditNFT is ERC721URIStorage, Ownable {
    uint256 private _nextId;

    constructor() ERC721("AuditNFT", "AUDT") {}

    /// Mint a new token with metadata URI
    function mintTo(address to, string calldata uri) external onlyOwner returns (uint256) {
        uint256 id = ++_nextId;
        _safeMint(to, id);
        _setTokenURI(id, uri);
        return id;
    }
}
