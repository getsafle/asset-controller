const Web3 = require('web3');
const contracts = require('@metamask/contract-metadata');
const SINGLE_CALL_BALANCES_ABI = require('./constants/abi/single-call-balance-checker-abi')
const { SINGLE_CALL_BALANCES_ADDRESS } = require('./config');
const { CONTRACT_EXECUTION_ERROR, INVALID_TOKEN_TYPE } =require('./constants/responses') 

class AssetController {
    constructor({ rpcURL, userAddress }) {
        this.userAddress = userAddress,
        this.rpcURL = rpcURL;
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcURL));
    }

    async detectTokens(tokenType) {
        const tokensToDetect = [];
        const tokenBalance = [];
        if (tokenType == null || tokenType == undefined) {
            for (const contractAddress in contracts) {
                tokensToDetect.push(contractAddress);
            }
        }
       else if (tokenType === 'erc20') {
            for (const contractAddress in contracts) {
                if (contracts[contractAddress].erc20) {
                    tokensToDetect.push(contractAddress);
                }
            }
        }
      else  if (tokenType === 'erc721') {
            for (const contractAddress in contracts) {
                if (contracts[contractAddress].erc721) {
                    tokensToDetect.push(contractAddress);
                }
            }
        }
        else {
            return { error: INVALID_TOKEN_TYPE };
        }
        let result;
        try {
            result = await this.getTokenBalances(tokensToDetect);

        } catch (error) {
            return { error };
        }

        tokensToDetect.forEach((tokenAddress, index) => {
            let balance = result[index];
            if (balance && balance != 0) {
                tokenBalance.push({
                    balance,
                    tokenAddress: tokenAddress,
                    symbol: contracts[tokenAddress].symbol,
                    decimal: contracts[tokenAddress].decimals,
                    erc20: contracts[tokenAddress].erc20,
                    erc721: contracts[tokenAddress].erc721,
                });
            }
        });
        return tokenBalance;
    }

    async getTokenBalances(tokensToDetect) {
        const ethContract = new this.web3.eth.Contract(SINGLE_CALL_BALANCES_ABI, SINGLE_CALL_BALANCES_ADDRESS);
        try {
            const balance = await ethContract.methods.balances([this.userAddress], tokensToDetect).call();
            return balance;
        } catch (error) {
            return { error: CONTRACT_EXECUTION_ERROR };
        }
    }
}

module.exports = { AssetController: AssetController }