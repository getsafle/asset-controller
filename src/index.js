const Web3 = require('web3');
const SINGLE_CALL_BALANCES_ABI = require('./constants/abi/single-call-balance-checker-abi');
const { CONTRACT_EXECUTION_ERROR, INVALID_TOKEN_TYPE, INVALID_CHAIN_SELECTED } =require('./constants/responses') 
const helper = require('./utils/helper');
const config = require('./config');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

class AssetController {
    constructor({ rpcURL, chain }) {
        this.rpcURL = rpcURL;
        this.chain = chain;
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcURL));
    }

    async detectTokens({ tokenType, userAddress }) {

        const { error, contracts, SINGLE_CALL_BALANCES_ADDRESS } = await helper.getChainDetails(this.chain);

        if(error){
          return { error: INVALID_CHAIN_SELECTED };
        }
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
            result = await this.getTokenBalances(tokensToDetect, SINGLE_CALL_BALANCES_ADDRESS, userAddress);

        } catch (error) {
            return { error };
        }

        tokensToDetect.forEach((tokenAddress, index) => {
            let balance = result[index];
            if (balance && balance != 0) {
            tokenBalance.push({
            balance,
            tokenAddress: tokenAddress,
            symbol: DOMPurify.sanitize(contracts[tokenAddress].symbol),
            decimal: contracts[tokenAddress].decimals,
            erc20: contracts[tokenAddress].erc20,
            erc721: contracts[tokenAddress].erc721,
            });
            }
            });
        return tokenBalance;
    }

    async getTokenBalances(tokensToDetect, SINGLE_CALL_BALANCES_ADDRESS, userAddress) {
        const ethContract = new this.web3.eth.Contract(SINGLE_CALL_BALANCES_ABI, SINGLE_CALL_BALANCES_ADDRESS);
        try {
            const balance = await ethContract.methods.balances([userAddress], tokensToDetect).call();
            return balance;
        } catch (error) {
            return { error: CONTRACT_EXECUTION_ERROR };
        }
    }

    async getChains(symbol){
        let output;

        const { response, error } = await helper.getRequest({ url: config.CONTRACT_DATA_URL });

        if (error) {
            const { response } = await helper.getRequest({ url: config.FALLBACK_ASSETS_API });

            output = response;
        } else {
            output = response;
        }

        const { chains } = output;

        const supportedChains = [];
        symbol = symbol.toUpperCase();
        for (const chain in chains) {
            let contractMap = chains[chain].CONTRACT_MAP;
               for (const contractAddress in contractMap) {
                   if (contractMap[contractAddress].symbol === symbol) {
                     supportedChains.push(chain);
                   }
                 }
                   if(chains[chain].COIN.symbol === symbol){
                     supportedChains.push(chain);
               }
        };

        return supportedChains;
    }

}

module.exports = { AssetController: AssetController }