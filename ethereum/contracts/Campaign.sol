pragma solidity ^0.4.17;

// this contract exists as a hub for all the deployed campaigns 
// user will call/pay gas to this contract, which will deploy a new copy of "Campaign" contract
contract CampaignFactory {
    // variables
    address[] public deployedCampaigns;

    // creates a new Contract that gets deployed to the blockchain
    function createCampaign(uint minimum) public {
        // deploys a new instance of Campaign contract and collects the address for the user whos trying to launch a new cmapaign 
        address newCampaign = new Campaign(minimum, msg.sender);
        // add the newCampaign to the deployedCampaigns array
        deployedCampaigns.push(newCampaign);
    }

    // returns the entire array of deployed campaigns 
        // 'public' means anyone can call the function 
        // 'view' means no data inside the contract is changed 
        // 'returns' just returns the value type
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        // only the contract manager can do * 
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        // make sure the value passed is greater than the minimumContribution 
        require(msg.value > minimumContribution);
        // add the user to the approvers mapping 
        approvers[msg.sender] = true; 
        // increment the approversCount variable
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        //1. make sure the approver has paid into the Contract 
        require(approvers[msg.sender]);
        //2. Make sure the approver hasn't already approved this request 
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        // increase the Yes Count
        request.approvalCount++;
    }
    

    // only the manger can call this function (hence: 'restricted')
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        // make sure approval rating is 50% + 
        require(request.approvalCount > (approversCount / 2));
        // make sure the campaign isn't already complete 
        require(!request.complete);

        // take the tokens out and send to the recipient
        request.recipient.transfer(request.value);
        //  end the campaign 
        request.complete = true;
    }

    //returns info about the campaign
    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (this.balance, minimumContribution, requests.length, approversCount, manager);
    }

    function geRequestCount() public view returns (uint){
        return requests.length;
    }
}