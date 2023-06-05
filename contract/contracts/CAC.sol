// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract CAC is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string baseURI;
    string public unrevealedURI;
    string public baseExtension = ".json";

    // owner's state
    bool public _isSaleActive = false; // enable to mint
    bool public _revealed = false; // enable to reveal metadata

    // constants
    uint256 public constant MAX_SUPPLY = 20;
    uint256 public maxBalance = 5; // max balance of sender
    uint256 public maxMint = 2;
    uint256 public mintPrice = 0.03 ether; // matic

    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory initBaseURI, string memory initUnrevealedURI)
        ERC721("Chilling Avo Club", "CAC")
    {
        setBaseURI(initBaseURI);
        setUnrevealedURI(initUnrevealedURI);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (_revealed == false) {
            return unrevealedURI;
        }

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return
            string(abi.encodePacked(base, tokenId.toString(), baseExtension));
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(uint256 tokenQuantity) public payable {
        // check if mint over current total supply
        require(
            totalSupply() + tokenQuantity <= MAX_SUPPLY,
            "Exceeds max supply"
        );

        // check if sale active
        require(_isSaleActive, "Sale is not ready to mint");

        // check if qty over max balance
        require(
            balanceOf(msg.sender) + tokenQuantity <= maxBalance,
            "Sale exceeds max balance"
        );

        // check if qty over max mint
        require(tokenQuantity <= maxMint, "Exceeds max mint");

        // check if has enough gas fee
        require(tokenQuantity * mintPrice <= msg.value, "Not enough gas fee");

        // mint with safe mint
        _mintMyNFT(tokenQuantity);
    }

    // mint helper wraps safe mint internal
    function _mintMyNFT(uint256 tokenQuantity) internal {
        // get token id by length of totalSupply() in loop
        for (uint256 i = 0; i < tokenQuantity; i++) {
            uint256 tokenIndex = totalSupply(); // return token length

            // enable to mint if index not over max supply
            if (tokenIndex <= MAX_SUPPLY) {
                // msg is solidity global variable
                _safeMint(msg.sender, tokenIndex);
            }
        }
    }

    // withdraw
    function withdraw(address to) public onlyOwner {
        uint256 balance = address(this).balance;

        payable(to).transfer(balance);
    }

    // setter
    function flipSaleActive() public onlyOwner {
        _isSaleActive = !_isSaleActive;
    }

    function flipRevealed() public onlyOwner {
        _revealed = !_revealed;
    }

    function setBaseURI(string memory newbaseURI) public onlyOwner {
        baseURI = newbaseURI;
    }

    function setUnrevealedURI(string memory newUnrevealedURI) public onlyOwner {
        unrevealedURI = newUnrevealedURI;
    }

    function setBaseExtension(string memory newBaseExtension) public onlyOwner {
        baseExtension = newBaseExtension;
    }

    function setMaxMint(uint256 newMaxMint) public onlyOwner {
        maxMint = newMaxMint;
    }

    function setMaxBalance(uint256 newMaxBalance) public onlyOwner {
        maxBalance = newMaxBalance;
    }

    function setMintPrice(uint256 newMintPrice) public onlyOwner {
        mintPrice = newMintPrice;
    }

    // getter
    function getContractBalance() public view onlyOwner returns (uint) {
        return address(this).balance;
    }

    function getSaleActive() public view returns (bool) {
        return _isSaleActive;
    }

    function getRevealed() public view returns (bool) {
        return _revealed;
    }

    function getMaxMint() public view returns (uint256) {
        return maxMint;
    }

    function getMaxBalance() public view returns (uint256) {
        return maxBalance;
    }

    function getMintPrice() public view returns (uint256) {
        return mintPrice;
    }

    function getMaxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }

    function getTotalSupply() public view returns (uint256) {
        return totalSupply();
    }

    function isContractOwner() public view returns (bool) {
        return address(owner()) == address(msg.sender);
    }

    function getOwnerBalance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }
}
