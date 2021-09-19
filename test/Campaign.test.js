//! cd test > npm run test

//! this contains tests for both Campaign + CampaignFactory contracts 
const assert = require("assert"); // helper library from Node
const ganache = require("ganache-cli"); // our local TestNet
const Web3 = require("web3"); // creating a Constructor function 
const web3 = new Web3(ganache.provider()); //  new instance. provider() allows us to connect to the network 

// require the two compiled versions of our contracts 
const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts;
let factory; // the deployed instance of the Factory 
let campaignAddress; 
let campaign; 


beforeEach(async () => {
    accounts = await web3.eth.getAccounts(); // get list of accounts 
    
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({
        data: compiledFactory.bytecode,
      })
      .send({ from: accounts[0], gas: "1000000" });
    
    await factory.methods.createCampaign('100').send ({
        from: accounts[0], 
        gas: "1000000",
    });

    // get listing of all our deployd campaigns
    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    //! create our instance of the campaign
    campaign = await new web3.eth.Contract(
        // takes 2 arguments- 
        // the ABI
        JSON.parse(compiledCampaign.interface),
        // the address
        campaignAddress
    )
});


describe('Campaigns', async () => {
    //* Make sure the campaign + campaignFactory were successfully deployed
    it("deploys a factory + campaign", () => {
        // factory check
        assert.ok(factory.options.address);
        // campaign check
        assert.ok(campaign.options.address);
    });

    it ("assigns the caller as the campaign manager", async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    });

    it("allows people to contribute money, and marks them as approvers",  async () => {
        // send money 
        await campaign.methods.contribute().send({
            value: '200',
            // by default, Ganache gives us 10 test accounts to use. We can just select whichever one you want. (besides [0])
            from: accounts[1]
        });

        // will return True/False
        const isContibuter = await campaign.methods.approvers(accounts[1]).call();
        // checks to see if True. Will fail if False
        assert(isContibuter);
    });

    it("requires a minimum contribution", async () => {
        try {
          await campaign.methods.contribute().send({
            // must be LESS than the minimum contributution (100wei)
            value: 0,
            from: accounts[1],
          });
          assert(false);
        } catch (err) {
          assert(err) 
        }
    });

    it("allows a manager to make a Payment Request", async () => {
        await campaign.methods
            .createRequest('buying batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        // returns our request 
        const request = await campaign.methods.requests(0).call();

        // make sure the request matches the description
        assert.equal('buying batteries', request.description)
    });

    it("processes requests", async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        // create the request of attempting to send 5eth to accounts[1]
        await campaign.methods
        // desc + amount of money + the target account to send to 
            .createRequest('test desc.', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
        });


        // we have to approve the request before it can be processed. We've only created one request, so its index (0)
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });



        // process the request 
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // get balanace of the account where we just sent the ETH
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');

        // take the string and converts to decimal number
        balance = parseFloat(balance);
        console.log(balance + ' balance in eth'); 
        // check to see if the balance is larger than some minimum number
        assert(balance > 100)
    });
})