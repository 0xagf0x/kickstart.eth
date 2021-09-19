// TO RUN THIS FILE - node deploy.js

require('dotenv').config({ path: '.env'}); 
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');

const providerAccount = new HDWalletProvider(
    // include your Metamask nuemonic code + link to the network you want to deploy to 
    // My metamask account

    //! this works but not secure
    "bind render purpose fork flip step stool fitness square burst lab gain", 'https://rinkeby.infura.io/v3/' + "cbf55bd481094fb7a99bfa2f05f340d1"
    // process.env.MNEMONIC, 'https://rinkeby.infura.io/v3/' + process.env.API_KEY
);

const web3 = new Web3(providerAccount);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('attemping to deploy from account: ', accounts[0])

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) 
    .deploy({data: compiledFactory.bytecode})
    .send ({
        from: accounts[0],
        gas: '1000000'
    })

    // console.log(result)
    // console.log('-----------------------------------------------------------')
    console.log('Contract deployed to', result.options.address);
    console.log(compiledFactory.interface);
};

deploy();