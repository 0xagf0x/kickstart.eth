//! npm run dev 
import React, { Component } from "react";
import factory from "../ethereum/factory";
import 'semantic-ui-css/semantic.min.css';
import { Card, Button } from "semantic-ui-react";
import Layout from '../components/Layout';
import { Link } from '../routes';


class CampaignIndex extends Component {
    //* this is specific to NextJS (you have to do getInitialProps)
    // NextJS requires this so they can get the data before rendering the component
    // 'static' defines a Class function
    // needs 'async' because contains async code 
    static async getInitialProps() {
        // get the campaigns that have been deployed
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        console.log(campaigns);
        //* return an object and now we can reference this.props.campaigns
        return { campaigns }
    }

    componentDidMount() {
        const bodyElement = document.getElementsByTagName("body")[0];
        const outerContainer = document.getElementById('__next');
        bodyElement.style.backgroundImage= 'linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% )';
        outerContainer.classList.add('main');
        outerContainer.style.height = "100%";
    }
    

    renderCampaigns() {
        //! create cards 
        // itterate over the object and print cards 
        const items = this.props.campaigns.map(address => {
            return {
                // these fields are from semantic-ui's website 
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true // this is width: 100%
            }
        });

        return <Card.Group items={items} />
    }

    // print to browser 
    render() {
        return (
            <Layout>
                <div>
                    {/* <h1 className="test">blhahahsad</h1> */}
                    <Link route="/campaigns/new">
                        <a>
                            <Button 
                            // these come from semantic-ui
                                content="Create Campaign"
                                icon="add"
                                primary // true
                                labelPosition="right"
                                floated = 'right' // sets up float: css class
                            />
                        </a>
                    </Link>
                    <h1>Current Campaigns:</h1>
                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;
