# VUZI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![JavaScript](https://img.shields.io/badge/Javascript-yellow)
![Next.js](https://img.shields.io/badge/Next.js-gray)
![Tailwind](https://img.shields.io/badge/Tailwind-blue)
![Solidity](https://img.shields.io/badge/Solidity-black)
![ZK-SNARKS](https://img.shields.io/badge/zkSNARKS-gray)
![Contributors](https://img.shields.io/github/contributors/Muziris-Labs/VUZI-Wallet?color=dark-green) 
![Issues](https://img.shields.io/github/issues/Muziris-Labs/VUZI-Wallet) 

> Embedded Seedless Smart Wallets

This is the raw implementation for the _[MyVuzi.com](https://myvuzi.com/)_ hackathon project at [Viction Horizon Startup Hackathon](https://horizon.viction.xyz/)

## Table Of Contents

* [How It Works](#how-it-works)
* [About the Project](#about-the-project)
* [Project Contents](#project-contents)
  * [VUZI Contracts](#vuzi-contracts)
  * [VUZI ZK-Circuits](#vuzi-zk-circuits)
  * [VUZI Client](#vuzi-client)
  * [VUZI Server](#vuzi-server)
* [License](#license)
* [Authors](#authors)

## How it Works 

### User Authentication using ZK-SNARKS

![Flow Diagram2](https://github.com/Muziris-Labs/VUZI-Wallet/assets/38689344/4e78d835-e8e9-46d7-9df0-ecdf8d12def5)

### ERC 2771 Implementation with ZK-Snarks

![ERC 2771 implementation with ZK Snarks](https://github.com/Muziris-Labs/VUZI-Wallet/assets/38689344/2934072a-287c-4e0e-ba74-37b83d7330ad)

## About The Project

Navigating crypto wallets can be tricky. But not with Vuzi! We're all about making it simple and super secure.

Managing wallets is about more than just remembering a bunch of words. It's like a dance between you, your assets, and those blockchain networks. We make sure it's a smooth dance, not a complicated one.

Our pitch is straightforward: we simplify crypto wallet management, making it a breeze for your users. No more headaches, just a secure and user-friendly experience. Let's make crypto wallets easy for everyone in this ever-changing landscape!

Here are some cool features of Vuzi:

*  **Seedless Wallet**  Generate crypto wallets without a public key, Private key pair, or any 12 work passwords you must remember.
* **onChain 2FA** Protect your wallet with our onChain 2FA module powered by Passkeys.
* **Crosschain**  Interact with any EVM chain. You should element DRY principles to the rest of your life :smile:
* **Web2 login** login to your web3 wallet with the comfort of your web2 accounts. 

Of course, a simple, smart wallet will only serve some of your needs. Vuzi is a modular wallet infrastructure where you can deploy user wallets using our SDK.

## Who needs Vuzi Infra?
* Web3 Game development: User Vuzi wallets in your game to securely store in-game assists for your users.
* Crypto Art galleries: Do you want your users not to worry about wallets, when all they want is to buy cute crypto kitties?
* DeSo: anyone who is building the next x alternative or friendTech, deploy wallets with custom logics faster with Vuzi. 

> [!TIP]  
> Vuzi stands for ''Easy'' in web3 language.  

# Project Contents

- Contracts
- ZK-Circuits
- Client
- Server
 
# VUZI Contracts

![Solidity](https://img.shields.io/badge/Solidity-blue)

The repository was scaffolded with [`scaffold-eth-2`](https://github.com/scaffold-eth/scaffold-eth-2).

## Run Locally

Refer to [Scaffold-eth-2](https://docs.scaffoldeth.io/) Documentation on how to deploy through its open source, up-to-date toolkit

Contracts can be found at

```bash
  cd Contracts/packages/hardhat/contracts
```

ABIs can be found at

```bash
  cd Contracts/packages/nextjs/contracts
```

# VUZI ZK-Circuits

![ZK-SNARKS](https://img.shields.io/badge/zkSNARKS-gray)![Zokrates](https://img.shields.io/badge/Zokrates-blue)

Install dependencies

```bash
  curl -LSfs get.zokrat.es | sh
```

Go to the Passcode directory

```bash
  cd ZK-Circuits/Passcode
```

Run the following Commands

```bash
  # compile
  zokrates compile -i provingPasscode.zok
  # perform the setup phase
  zokrates setup
  # export a solidity verifier
  zokrates export-verifier
```

# VUZI Client

![JavaScript](https://img.shields.io/badge/Javascript-yellow)
![Next.js](https://img.shields.io/badge/Next.js-gray)
![Tailwind](https://img.shields.io/badge/Tailwind-blue)

The repository was scaffolded with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`NEXT_PUBLIC_BACKEND_URL` The Url of the VUZI server deployed on localhost or any other third party cloud service

`NEXT_PUBLIC_API_KEY` Specific API key to authenticate with VUZI Server

`NEXT_PUBLIC_DOMAIN_URL` Auth0 Domain URL

`NEXT_PUBLIC_CLIENT_ID` Auth0 Client ID

## Run Locally

Go to the client directory

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Start the dev server

```bash
  npm run dev
```

# VUZI Server

![Javascript](https://img.shields.io/badge/Javascript-yellow)
![Express.js](https://img.shields.io/badge/express.js-gray)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` Port on which the server would be running

`API_KEY` API Key to receive requests from VUZI Client

`PRIVATE_KEY` Private Key of the Wallet who will be forwarding your transaction

`NEXT_PUBLIC_CLIENT_ID` Auth0 Client ID

`RPC_URL` RPC URL of the supported chain

`RELAYER_ADDRESS` ERC 2771 Forwarder deployed address

Go to the server directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## License

Distributed under the MIT License. See [LICENSE](https://github.com/Muziris-Labs/VUZI-Wallet/blob/main/LICENSE.md) for more information.

## Authors

* **AnoyRC** - [AnoyRC](https://github.com/AnoyRC) - **Tech**
* **Baer.Eth** - [Baer.Eth](https://github.com/0xbaer) - **Marketing and Ops**
