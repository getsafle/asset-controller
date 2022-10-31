# Safle Asset Controller

This SDK is used to detect the tokens and their balances in a given user's public address.

## Installation

To install this SDK,

```sh
npm install --save @getsafle/asset-controller
```

## Initialization

Initialize the constructor,

```js
const safleAssetController = require('@getsafle/asset-controller');

const assetController = new safleAssetController.AssetController({ rpcURL, chain });
```

<br>

> Detect Tokens

<br>

This function will detect and return the list of all the tokens in the user's public address.

```js
const tokenBalance = await assetController.detectTokens({ userAddress, tokenType });
```

* `userAddress` - User Public Address
* `tokenType` - optional parameter - valid values- erc20/erc721

<br>

> Get list of chains on which a token exists

<br>

This function will return the list of all the chains which a particular token is supported

```js
const chains = await assetController.getChains(tokenSymbol);
```

* `tokenSymbol` - Token Symbol

<br>

> Get token balances

<br>

This function will return the balances of all the tokens contract addresses passed in the array

```js
const chains = await assetController.getTokenBalances(tokensToDetect, SINGLE_CALL_BALANCES_ADDRESS, userAddress);
```

* `tokensToDetect` - array of all the token addresses
* `SINGLE_CALL_BALANCES_ADDRESS` - Contract address of the single call balance checker contract
* `userAddress` - Public address of the user to query the balance of
