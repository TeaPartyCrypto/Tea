# tea

<p align="center">
<img width="200" src="/teapartybiglogo.png" alt="Material Bread logo">
<p align="center">
The application interface for `TeaParty` 
</p>
</p>


## Design / Overview

`TeaParty` consists of two core parts `tea` & `party`, as illustrated by the diagram below. 

* `party` - A suite of services and logic that support the platform. This is where all the magic happens 🪄 ( If this sounds complicated, just think of `party` as the 🧠 "brains" 🧠 of the project .) 

* `tea` - A suite of services and logic to make it easy for users to interact with `party` 

<p align="center">
<img width="200" src="/teadiagram.png" alt="Material Bread logo">
<p align="center">


`tea` was elected to be designed as a desktop application over a hosted web service in order to provide users with the most control, safety, privacy, and security, while interacting with the marketplace. (**Note** Although `tea` is packaged as a desktop application, it does not have to run on your local desktop! In fact it is quite happy living on a remote server.)

`tea` works by first checking for a local [NKN](https://nkn.org/) wallet, `wallet`, file and begins listing to this address. If this file does not exist, a new account is created for the user. (**NOTE** This file, `wallet`, is very imporant and should be treated as any other wallet or private key. Do not delete, move, or alter this file while you have open or pending trades as your NKN public address is how `party` talks to your `tea` client.)

After starting the NKN connection, `tea` also begins serving the static assets located at `kodata` (our React application) while exposing several API endpoints for the user to interact with `Party` 

`tea` is now at your disposal to interact with 🎉`Party`🎉

### Current Supported Assets

`TeaParty` currently supports the trade of the following assets:
* MineOnlium
* Ethereum
* Polygon
* Celo
* Solana
* ANY - ( Users are able to list trades for `ANY` of the supported assets by defining a USD value for the trade) 


### Asset Support Comming Soon

I am currently in the process of introducing the following assets into `TeaParty`

* NFT's (on all supported chains) 
* Kaspa
* Radiant
* Bitcoin
* Raven
* Ergo
* .... Want `TeaParty` to support something not on the roadmap? [submit](https://github.com/TeaPartyCrypto/Tea/issues) an issue and let me know! 


## Getting Started
**NOTE** Tea is currently in BETA and the only server avalible is the staging enviorment. In the staging environment there are several **IMPORTANT** differences from the production environment:

1. All of the RPC's are pointing to the following networks 

(**DO NOT SEND MAINNET CURRENCY**)

       * Ethereum: Goerli ([faucet](https://www.alchemy.com/overviews/goerli-faucet))

       * Polygon: Mumbai ([faucet](https://faucet.polygon.technology/))

       * Solana: Testnet ([faucet](https://solfaucet.com/))

       * Celo: Alfajores ([faucet](https://celo.org/developers/faucet))

       * MO: Mainnet (Soon to be testnet with faucet) 

1. The watch timeout has been taken down to 300 secconds from 2 hours ( After 300 secconds any pending transaction will fail) 

1. Currently, users still have to pay for the transaction fees ( I will personally reimburse any and all MO costs incurred while playing on testnet untill the faucet is setup. 


### System Prerequisites for Running `tea`

`tea` is currently distribuited as both a container image and a Linux binary. This path was taken to support a maximum number of runtime environments at launch, however, the packaging will change over time to make it accessable to non Linux/Docker users.

Please download and configure Docker for your system. (GUI - [download](https://www.docker.com/products/docker-desktop/) CLI - [download](https://docs.docker.com/get-docker/))

If you need help getting started, feel free to join us in the MineOnlium [Discord!](https://discord.gg/4JFjejV4FN) or PM me directly on Discord @ Filth#5858 (439229993625714688)

You can also post in the Github [Discussions](https://github.com/TeaPartyCrypto/Tea/discussions)

Here are a few things you can currently do with `tea`:

* Browse the marketplace. 
* Create new orders. 
* View acquired Private Keys.
* Remove acquired Private Keys from the local filesystem. 
* Interact with the `TeaParty` smart contract to pay for transaction fees, currently set @ 1 MO/ Transaction. ( **NOTE:** ALL MO Accounts with a balance over 17k have FREE access to Buy and Sell with `TeaParty`) 


### Start `tea` from a release
Releases can be downloaded from the releases on the right side of the homepage of this repository on github. Or the most current build is always avalible in the `release` directory. 

Start a release by navigating into the `/release` folder (either within this repo. or via download) and executing the following:

```
docker compose up -d
```

### Build an run `tea` from source for LOCAL testing

To start `tea` pointing to a local instance of `Party`:

```cmd
make run
```

You can now visit `http://localhost:8081` to view the interface.

### Build an run `tea` from source for STAGING testing

To start `tea` pointing to the STAGING instance of `Party`:

```cmd
make staging
```

You can now visit `http://localhost:8081` to view the interface.

### Build an run `tea` from source for PRODUCTION testing

To start `tea` pointing to the production instance of `Party`:

```cmd
make prod
```

You can now visit `http://localhost:8081` to view the interface.

### Build and Bundle from Source

Execute the following to build and bundle the application from source:

```cmd
make build
```

**Note** That `make debug` is also avalible, this will build the project and then imediatly start serving a local revision. 


# Developer 

## Contributing

Currently `teaparty` is being devloped solo. So I am more than happy to accept any and all contributions/issues/requests/input from the community! 

Interested? Try:

* [Submiting](https://github.com/TeaPartyCrypto/Tea/pulls) a PR. 
* [Creating](https://github.com/TeaPartyCrypto/Tea/issues) an issue!
* Join the MineOnlium [Discord](https://discord.gg/4JFjejV4FN).
* PM me on Discord @ Filth#5858 (439229993625714688).

## Backend Interactions 
### /sell

`/sell` provides an interface for creating new sell requests. It expects an HTTP Post request containing the following JSON schema:

| Key      | Description | 
| ----------- | ----------- |
| currency      | The asset the seller wishes to post for trade       |
| amount   | The quantity of `currency` the seller wishes to trade        |
| tradeAsset   |   The asset the seller wishes to obtain       |
| price   | The quantity of `tradeAsset` the seller wishes to obtain        |
| sellerShippingAddress   | An address on the `tradeAsset` network that the seller wishes to recieve payment on   |
| paymentTransactionID   | The Users Address on the MO Blockchain that has paid for a `TeaParty` transaction via the smart contract. |

Example curl request:
```cmd
curl -v "http://0.0.0.0:8081/sell" \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"currency":"kaspa","amount": 10000 ,"tradeAsset":"kaspa","price":10000, "sellerShippingAddress": "kaspa:qqttgqrl38an9r543qnn0g3lywuhsp8cy5e04lfrfsgadnjcdgmsg8zvmjgrj", "paymentTransactionID":"0x5bbfa5724260Cb175cB39b24802A04c3bfe72eb3"}'
```

### /list
`/listorders` provides an interface for listing the avalible orders. It expects an HTTP GET request. 

Example curl request:
```cmd 
curl -v "http://localhost:8081/list" 
```

### /buy
`/buy` provides an interface for purchasing an open order. It expects an HTTP Post request containing the following JSON schema:


| Key      | Description | 
| ----------- | ----------- |
| txid      | A Transaction ID for the order in question.     |
| buyerShippingAddress      | An address on the `tradeAsset` network that the buyer wishes to recieve payment on.    |
| paymentTransactionID      |  The Users Address on the MO Blockchain that has paid for a `TeaParty` transaction via the smart contract.   |

Example curl request:
```cmd
curl -v "http://localhost:8081/buy" \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"txid":"30e16ef3-8ada-453d-adee-bafd242cb91", "buyerShippingAddress":"0x5bbfa5724260Cb175cB39b24802A04c3bfe72eb3","paymentTransactionID":"0x5bbfa5724260Cb175cB39b24802A04c3bfe72eb3"}'
```

### /getPrivateKeys
`/getPrivateKeys` provides an interface for retreving the locally stored Private keys. It expects an HTTP Get request. 

Example curl request:
```cmd
curl -v "http://localhost:8081/getPrivateKeys" \
```

## /deletePK
`/deletePK` provides an interface for deleting the locally stored keys. It expects an HTTP Post request containing the following JSON schema:

| Key      | Description | 
| ----------- | ----------- |
| address      | The public address of the key to delete. |


Example curl request:
```cmd
curl -v "http://localhost:8081/buy" \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"address":"0x5bbfa5724260Cb175cB39b24802A04c3bfe72eb3"}'
```
