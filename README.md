# **Safle Asset Controller**

Safle Asset Controller SDK


## **Installation and Usage**

> Installation

Install the package by running the command,

`npm install @getsafle/asset-controller`

Import the package into your project using,

`const safleAssetController = require('@getsafle/asset-controller');`

## **Asset Controller**

> Initialising

Initialise the constructor using,

`const assetController = new safleAssetController.AssetController({ userAddress, rpcURL, chain });` 

* `userAddress` - User Public Address
* `rpcURL` - Web3 RPC provider URL
* `chain` - name of blockchain

> Methods

Detect user tokens

`const tokenBalance = await assetController.detectTokens(tokenType);`

* `tokenType` - optional parameter - valid values- erc20/erc721

