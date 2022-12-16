
const config = require('../config');
const axios = require('axios');
const { INVALID_CHAIN_SELECTED } = require('../constants/responses');

const getChainDetails = async (chain) => {
    let output;

    const { response, error } = await getRequest({ url: config.CONTRACT_DATA_URL });

    if (error) {
        const { response } = await getRequest({ url: config.FALLBACK_ASSETS_API });

        output = response;
    } else {
        output = response;
    }
    
    const { supportedChains, chains } = output;

    if (!supportedChains.includes(chain)) {
        return { error: INVALID_CHAIN_SELECTED };
    }
    else {
        return { contracts: chains[chain].CONTRACT_MAP, SINGLE_CALL_BALANCES_ADDRESS: chains[chain].SINGLE_CALL_BALANCES_ADDRESS };
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
module.exports = { getChainDetails, getRequest };

