//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Exchange is ERC20 {
    address public cryptoDevTokenAddress;

    constructor(address _CryptoDevToken) ERC20("CryptoDev LP Token", "CDLP") {
        require(
            _CryptoDevToken != address(0),
            "Token address passed is a null address"
        );
        cryptoDevTokenAddress = _CryptoDevToken;
    }

    /**
     * @dev Returns the amount of "Crypto Dev Tokens" held by the contract
     */
    function getReserve() public view returns (uint) {
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }

    /**
     * @dev Adds liquidity to the exchange.
     *
     */
    function addLiquidity(uint _amount) public payable returns (uint) {
        //liquidity is the ERC20 token;
        uint liquidity;
        // eth/cryptoDevToken is the pair ,ethBalance is equal to msg.value
        uint ethBalance = address(this).balance;
        uint cryptoDevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);

        if (cryptoDevTokenReserve == 0) {
            //this is the first add liquid ,
            //the ratio is up to exist eth of the contract and the input cryptoDevToken
            cryptoDevToken.transferFrom(msg.sender, address(this), _amount);

            liquidity = ethBalance;
            // liquidity add by mint way
            _mint(msg.sender, liquidity);
        } else {
            uint ethReserve = ethBalance - msg.value;
            // input eth / ethReserve = input cdtoken / cdtokenReserve
            //
            uint cryptoDevTokenAmount = (msg.value * cryptoDevTokenReserve) /
                ethReserve;
            require(
                _amount >= cryptoDevTokenAmount,
                "Amount of tokens sent is less than the minimum tokens required"
            );
            cryptoDevToken.transferFrom(
                msg.sender,
                address(this),
                cryptoDevTokenAmount
            );
            // input eth /ethReserve = output liquidity/liquidityReserve
            liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);
        }
        return liquidity;
    }

    function removeLiquidity(uint _amount) public returns (uint, uint) {
        // _amount is the amount of input liquidity
        require(_amount > 0, "_amount should be greater than zero");
        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();
        // input liquidity / liquidityReserve = output eth/ ethReserve
        uint ethAmount = (ethReserve * _amount) / _totalSupply;
        //input liquidity / liquidityReserve = output cdtoken /cdtokenReserve
        uint cryptoDevTokenAmount = (getReserve() * _amount) / _totalSupply;
        //liquidity output is burn way
        _burn(msg.sender, _amount);
        // transfer out the eth and cdtoken
        payable(msg.sender).transfer(ethAmount);
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);
        return (ethAmount, cryptoDevTokenAmount);
    }

    /**
     * @dev return the amount ETH/Crypto Dev tokens that would be returned to the user in the swap
     */
    function getAmountOfTokens(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        uint256 inputAmountWithFee = inputAmount * 99;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }

    function ethToCryptoDevToken(uint _minTokens) public payable {
        uint256 tokenReserve = getReserve();
        uint256 tokensBought = getAmountOfTokens(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );
        require(tokensBought >= _minTokens, "insufficient output amount");
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokensBought);
    }

    function cryptoDevTokenToEth(uint _tokensSold, uint _minEth) public {
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmountOfTokens(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );
        require(ethBought >= _minEth, "insufficient output amount");
        ERC20(cryptoDevTokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        // send the `ethBought` to the user from the contract
        payable(msg.sender).transfer(ethBought);
    }
}
