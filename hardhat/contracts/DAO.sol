// SPDX-License-Identifier:MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDevs.sol";
import "./IFackNFTMarketplace.sol";

pragma solidity ^0.8.0;

contract DAO is Ownable {
    struct Proposal {
        // nft tokenId
        uint256 nftTokenId;
        // the UNIX timestamp until with this proposal is active
        uint256 deadline;
        // vote yes for this proposal
        uint256 yayVotes;
        // vote no for this proposal
        uint256 nayVotes;
        // whether or not this proposal has been executed yet.
        // Cannot be executed before the deadLine has been exceeded
        bool executed;
        // a mapping of NFT tokenIds to booleans indicating whether that
        // NFT has already been used to cast a vote
        mapping(uint256 => bool) voters;
    }
    enum Vote {
        YAY,
        NAY
    }

    // a mapping of ID to Proposal
    mapping(uint256 => Proposal) public proposals;
    uint256 public numProposals;
    ICryptoDevs cryptoDevs;
    IFackNFTMarketplace nftMarketplace;

    constructor(address _nftMarketplace, address _cryptoDevsNFT) payable {
        cryptoDevs = ICryptoDevs(_cryptoDevsNFT);
        nftMarketplace = IFackNFTMarketplace(_nftMarketplace);
    }

    modifier nftHolderOnly() {
        require(cryptoDevs.balanceOf(msg.sender) > 0, "NOT a DAO member");
        _;
    }

    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "DEADLINE_EXCEDDED"
        );
        _;
    }
    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "DEADLINE_NOT_EXCEEDED"
        );
        require(
            proposals[proposalIndex].executed == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    function createProposal(uint _nftTokenId)
        external
        nftHolderOnly
        returns (uint256)
    {
        require(nftMarketplace.available(_nftTokenId), "NFT not for sale");
        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenId = _nftTokenId;
        proposal.deadline = block.timestamp + 5 minutes;
        numProposals++;
        return numProposals - 1;
    }

    function voteOnProposal(uint256 proposalIndex, Vote vote)
        external
        nftHolderOnly
        activeProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];
        uint256 voterNFTBalance = cryptoDevs.balanceOf(msg.sender);
        uint256 numVotes = 0;
        for (uint256 i = 0; i < voterNFTBalance; i++) {
            uint256 tokenId = cryptoDevs.tokenOfOwnerByIndex(msg.sender, i);
            numVotes++;
            proposal.voters[tokenId] = true;
        }
        require(numVotes > 0, "Already voted");
        if (vote == Vote.YAY) {
            proposal.yayVotes += numVotes;
        } else {
            proposal.nayVotes += numVotes;
        }
    }

    function executeProposal(uint256 proposalIndex)
        external
        nftHolderOnly
        inactiveProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];
        if (proposal.yayVotes > proposal.nayVotes) {
            uint256 nftPrice = nftMarketplace.getPrice();
            require(address(this).balance >= nftPrice, "Not enough funds");
            nftMarketplace.purchase{value: nftPrice}(proposal.nftTokenId);
        }
        proposal.executed = true;
    }

    function getNumProposals() external view returns (uint256) {
        return numProposals;
    }

    /// @dev withdrawEther allows the contract owner (deployer) to withdraw the ETH from the contract
    function withdrawEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // The following two functions allow the contract to accept ETH deposits
    // directly from a wallet without calling a function
    receive() external payable {}

    fallback() external payable {}
}
