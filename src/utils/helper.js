
const config = require('../config');
const axios = require('axios');
const { INVALID_CHAIN_SELECTED } = require('../constants/responses');

const getChainDetails = async (chain) => {
    let SINGLE_CALL_BALANCES_ADDRESS;

    switch (chain) {
        case 'ethereum': {
            const { response } = await getRequest({ url: config.ETH_CONTRACT_MAP_URL });
            SINGLE_CALL_BALANCES_ADDRESS = config.ETH_SINGLE_CALL_BALANCES_ADDRESS;
            return { contracts: response, SINGLE_CALL_BALANCES_ADDRESS };
        }
        case 'polygon':{
        const { response } = await getRequest({ url: config.POLYGON_CONTRACT_MAP_URL });
        SINGLE_CALL_BALANCES_ADDRESS = config.POLYGON_SINGLE_CALL_BALANCES_ADDRESS;
        return { contracts: response, SINGLE_CALL_BALANCES_ADDRESS };
        }
        default: {
            return { error: INVALID_CHAIN_SELECTED };
        }
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

