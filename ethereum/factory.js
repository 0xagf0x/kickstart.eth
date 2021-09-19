import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";


//create new instance of the Factory 
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x60Bfd798cfd5f9ca5F35B9ECCa167c2Ca2db97aD" // the address for the most recent Factory we've deployed
);

export default instance;
