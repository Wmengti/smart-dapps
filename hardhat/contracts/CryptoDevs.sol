//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./IWhiteList.sol";

contract CryptoDevs is ERC721, Ownable {
    using Counters for Counters.Counter;

    bool public _paused;
    bool public presaleStarted;
    uint256 public _price = 0.01 ether;
    uint256 public maxTokenIds = 20;
    Counters.Counter tokenIds;
    uint256 public presaleEnded;
    string _baseTokenURI;
    IWhiteList whitelist;

    modifier onlyWhenNotPaused() {
        require(!_paused, "Contract currently paused");
        _;
    }

    constructor(string memory _tokenbaseURI, address _whitelistContract)
        ERC721("CryptoDevs", "CD")
    {
        _baseTokenURI = _tokenbaseURI;
        whitelist = IWhiteList(_whitelistContract);
    }

    function startPresale(uint256 _time) public onlyOwner {
        require(!presaleStarted, "presale has started!");
        presaleStarted = true;
        presaleEnded = block.timestamp + _time * 1 minutes;
    }

    function presaleMint() public payable onlyWhenNotPaused {
        require(
            presaleStarted && block.timestamp < presaleEnded,
            "Presale is not running"
        );
        require(
            whitelist.whitelistedAddresses(msg.sender),
            "You are not whitelisted"
        );
        uint256 currentId = tokenIds.current();
        require(currentId < maxTokenIds, "Exceeded maximum Crypto Devs supply");
        require(msg.value >= _price, "Ether sent is not correct");
        tokenIds.increment();
        _safeMint(msg.sender, currentId);
    }

    function Mint() public payable onlyWhenNotPaused {
        require(
            presaleStarted && block.timestamp > presaleEnded,
            "Presale has not ended yet"
        );
        uint256 currentId = tokenIds.current();
        require(currentId < maxTokenIds, "Exceeded maximum Crypto Devs supply");
        require(msg.value >= _price, "Ether sent is not correct");
        tokenIds.increment();
        _safeMint(msg.sender, currentId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function getTokenIds() public view returns (uint256) {
        return tokenIds.current();
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
