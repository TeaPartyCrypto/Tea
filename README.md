# tea

<p align="center">
<img width="200" src="/teapartybiglogo.png" alt="Material Bread logo">
<p align="center">
The application interface for <a href="www.teapartycrypto.com">TeaParty</a>
</p>
</p>


## Design

`TeaParty` consists of two core parts `tea` & `party`, as illustrated by the diagram below. 

* `party` - The backend services and logic that support the platform. This is where all the magic happens 🪄 ( If this sounds complicated, just think of `party` as the 🧠 "brains" 🧠 of the project .) 

* `tea` - The frontend services and logic that support 

<p align="center">
<img width="200" src="/teadiagram.png" alt="Material Bread logo">
<p align="center">


`tea` was elected to be designed as a desktop application over a hosted web service in order to provide users with the most control, safety, privacy, and security, while interacting with the marketplace. (**Note** Although `tea` is packaged as a desktop application, it does not have to run on your local desktop! In fact it is quite happy living on a remote server.)

`tea` works by first checking for a local [NKN](https://nkn.org/) wallet, `wallet`, file and begins listing to this address. If this file does not exist, a new account is created for the user. (**NOTE** This file, `wallet`, is very imporant and should be treated as any other wallet or private key. Do not delete, move, or alter this file while you have open or pending trades as your NKN public address is how `party` talks to your `tea` client.)

After starting the NKN connection, `tea` also begins serving the static assets located at `cmd/kodata` (our React application) while expoing several API endpoints for the user to interact with `Party` 

`tea` is now at your disposal! 


## Getting Started

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

You can now visit `http://localhost:8080` to view the interface.

### Build an run `tea` from source for STAGING testing

To start `tea` pointing to the STAGING instance of `Party`:

```cmd
make staging
```

You can now visit `http://localhost:8080` to view the interface.

### Build an run `tea` from source for PRODUCTION testing

To start `tea` pointing to the production instance of `Party`:

```cmd
make prod
```

You can now visit `http://localhost:8080` to view the interface.

### Build and Bundle from Source

Execute the following to build and bundle the application from source:

```cmd
make build
```

**Note** That `make debug` is also avalible, this will build the project and then imediatly start serving a local revision. 


## Backend Interactions 
### /sell
`/sell` provides an interface for creating new sell requests. It expects an HTTP Post request containing the following JSON schema:


| Key      | Description | 
| ----------- | ----------- |
| currency      | The asset the seller wishes to post for trade       |
| amount   | The quantity of `currency` the seller wishes to trade        |
| tradeAsset   |   The asset the seller wishes to obtain       |
| price   | Te quantity of `tradeAsset` the seller wishes to obtain        |
| sellerShippingAddress   | An address on the `tradeAsset` network that the seller wishes to recieve payment on   |
| paymentTransactionID   | The Transaction ID proving that 1 MO has been burnt into the `paygate` 

Example curl request:
```cmd
curl -v "http://0.0.0.0:8080/sell" \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"currency":"kaspa","amount": 10000 ,"tradeAsset":"kaspa","price":10000, "sellerShippingAddress": "0x53d7818dA5679Ffb3F20FE86ae871D1F691ff409", "paymentTransactionID":"0xaf5a14b68044e743bb78e47794ed6c2719d5e2b254047c7a58d8ef9dcf513bc6"}'
```

### /list
`/listorders` provides an interface for listing the avalible orders. It expects an HTTP GET request. 

Example curl request:
```cmd 
curl -v "http://localhost:8080/list" 
```

### /buy
`/buy` provides an interface for purchasing an open order. It expects an HTTP Post request containing the following JSON schema:


| Key      | Description | 
| ----------- | ----------- |
| txid      | A Transaction ID for the order in question.     |
| buyerShippingAddress      | An address on the `tradeAsset` network that the buyer wishes to recieve payment on.    |
| paymentTransactionID      |  The Transaction ID proving that 1 MO has been burnt into the `paygate` contract.   |

Example curl request:
```cmd
curl -v "http://localhost:8080/buy" \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"txid":"30e16ef3-8ada-453d-adee-bafd242cb91", "buyerShippingAddress":"0x53d7818dA5679Ffb3F20FE86ae871D1F691ff409","paymentTransactionID":"0xb1306f77a428f99a01c888d172fc220805d30cfd46185f688eaf768eb1698d61"}'
```

### /getPrivateKeys
`/getPrivateKeys` provides an interface for retreving the locally stored Private keys. 

Example curl request:
```cmd
curl -v "http://localhost:8080/getPrivateKeys" \
```

## /deletePK
`/deletePK` provides an interface for deleting the locally stored keys. 

| Key      | Description | 
| ----------- | ----------- |
| address      | The public address of the key to delete. |


Example curl request:
```cmd
curl -v "http://localhost:8080/buy" \
       -X POST \
       -H "Content-Type: application/json" \
       -d '{"address":"0x5bbfa5724260Cb175cB39b24802A04c3bfe72eb3"}'
```

