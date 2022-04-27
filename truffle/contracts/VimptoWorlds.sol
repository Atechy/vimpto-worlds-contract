// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Verify.sol";

contract VimptoWorlds is Ownable, ERC721, ReentrancyGuard ,VerifySignature{

    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using Strings for uint256;

    Counters.Counter public _tokenIds;

    bool public transferrable = false;

    uint256 public constant mintSupply = 10000;

    uint256 public normalMintPrice = 1 ether;

    uint256 public whitelistMintPrice = 0.75 ether;

    string public ipfsGateway = "https://gateway.pinata.cloud/ipfs/";
    string public ipfsHash = "QmX49QfWRfNwot4c6k6FAP6jNXcn4ssCwjndLjNyToUyZT";

    mapping (address => bool) public whiteListedAddresses;
    mapping (address => bool) public partnerAddresses;

    address private admin;

    uint256 public addressMintingLimit = 3;

    modifier onlyWhitelisted() {
        require(whiteListedAddresses[msg.sender], "You are not whitelisted.");
        _;
    }

    modifier isTransferrable() {
        require(transferrable == false, "Transfer is currently locked");
        _;
    }

    constructor(address _admin) ERC721("VimptoWorlds", "VWS") {
        admin = _admin;
    }

    // PUBLIC

    function mintWhitelist() public payable onlyWhitelisted nonReentrant returns (uint256) {
        require(whiteListedAddresses[msg.sender] == true, "Only whitelisted addresses can mint.");
        if (whiteListedAddresses[msg.sender] == true && partnerAddresses[msg.sender] == false) {
            require(balanceOf(msg.sender) < addressMintingLimit, "Minting limit reached for this address.");
        } else {
            require(balanceOf(msg.sender) < addressMintingLimit + 1, "Minting limit reached for this address.");
        }
        require(mintSupply > _tokenIds.current(), "All 10,000 NFT's have been minted.");
        require(msg.value == whitelistMintPrice, "Mint price incorrect");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        isTotalMinted();
        return newItemId;
    }

    function mintToPartner( address _address) public onlyOwner returns (uint256) {
        require(mintSupply > _tokenIds.current(), "All 10,000 NFT's have been minted.");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(_address, newItemId);
        whiteListedAddresses[_address] = true;
        partnerAddresses[_address] = true;
        isTotalMinted();
        return newItemId;
    }

    struct MintPayload {
        address to;
        uint256 nonce;
    }

    function mintWorld(MintPayload calldata _payload, bytes memory _signature) public payable nonReentrant returns (uint256)  {

        require(mintSupply > _tokenIds.current(), "All 10,000 NFT's have been minted.");
        require(msg.value == normalMintPrice, "Mint price incorrect");
        require(verifyOwnerSignature(_payload, _signature), "Invalid Signature");
        require(balanceOf(_payload.to) < addressMintingLimit, "Minting limit reached for this address.");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(_payload.to, newItemId);
        isTotalMinted();
        return newItemId;

    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        
            return string(abi.encodePacked(ipfsGateway,ipfsHash,'/',tokenId.toString(),'.json'));
        
    }

    // INTERNAL

    function verifyOwnerSignature(MintPayload calldata _payload, bytes memory _signature) private view returns(bool) {

          bytes32 ethSignedHash = getEthSignedMessageHash(getMessageHash(_payload.nonce.toString(),_payload.to));
          return recoverSigner(ethSignedHash,_signature) == admin;

    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal view override {
        if(from != address(0)) {
            require(transferrable,"Transfer locked.");
        }
    }

    function isTotalMinted () internal {
        if(_tokenIds.current() == mintSupply) {
            transferrable = true;
        }
    }

    // PUBLIC ONLY OWNER

    function withdrawal() public onlyOwner {
            payable(owner()).transfer(address(this).balance);
    }

    function enableTransfer () public onlyOwner {
        transferrable = true;
    }

    function setAdmin (address _address) public onlyOwner {
        admin = _address;
    }

    function setIPFSGateway (string memory _ipfsgateway) public onlyOwner {
        ipfsGateway = _ipfsgateway;
    }

    function setIPFSHash (string memory _ipfshash) public onlyOwner {
        ipfsHash = _ipfshash;
    }

    function setAddressMintingLimit (uint256 _addressMintingLimit) public onlyOwner {
        addressMintingLimit = _addressMintingLimit;
    }

    function setNormalMintPrice(uint256 _price) onlyOwner external {
        normalMintPrice = _price;
    }

    // For whitelist

    function addWhitelist(address[] calldata _addresses) public onlyOwner {
        for (uint i = 0; i < _addresses.length; i++) {
            whiteListedAddresses[_addresses[i]] = true;
        }
    }

    function removeWhitelist(address[] calldata _addresses) onlyOwner public {
        for (uint256 i = 0; i < _addresses.length; i++) {
            whiteListedAddresses[_addresses[i]] = false;
        }
    }

    function setWhitelistMintPrice(uint256 _price) onlyOwner external {
        whitelistMintPrice = _price;
    }
}
