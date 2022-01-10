
const config = require('../config');
const axios = require('axios');
const { INVALID_CHAIN_SELECTED } = require('../constants/responses');

const getChainDetails = async (chain) => {
    
    if(!config.supportedChains.includes(chain))
    {
        return { error: INVALID_CHAIN_SELECTED };
    }
   else{
    const { response } = await getRequest({ url: config.chains[chain].CONTRACT_MAP_URL });
    return { contracts: response, SINGLE_CALL_BALANCES_ADDRESS: config.chains[chain].SINGLE_CALL_BALANCES_ADDRESS };
   }
}

const getRequest = async ({ url }) => {
    try {
        const response = await axios({
            url: `${url}`,
            method: 'GET',
        });
        return { response: response.data };
    } catch (error) {
        return { error: [{ name: 'server', message: 'There is some issue, Please try after some time' }] };
    }
};
module.exports = { getChainDetails };

