import React, { Component } from 'react';
import Layout from '../../components/Layout'
import 'semantic-ui-css/semantic.min.css';
import { Card, Grid, Button } from 'semantic-ui-react'
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';


class CampaignDetail extends Component {
    static async getInitialProps(props){
        // props.query.address;
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();

        console.log(summary)
        return {
            address: props.query.address,
            // this comes from getSummary() in the Solidity code 
            balance: summary[0],
            minimumContribution: summary[1],
            requests: summary[2],
            approvers: summary[3],
            manager: summary[4]
        };
    }

    componentDidMount() {
        const outerContainer = document.getElementById('__next');
        outerContainer.classList.add('main');
        outerContainer.style.height = "100%"
    }

    renderCards() {
        const {
            balance, // wei by default
            manager,
            minimumContribution,
            requests,
            approvers
        } = this.props;


        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money',
                //optional property
                style: {overflowWrap: 'break-word'},
            }, 
            {
                header: minimumContribution + " Wei",
                meta: 'Minimum Contribution',
                description: "You need to contribute this much to enter ",
            },
            {
                header: requests,
                meta: 'Requests',
                description: "A Request tries to withdraw money from the fund",
            },
            {
                header: approvers,
                meta: 'Approvers',
                description: "Approvers vote on the Withdraw Request",
            },
            {
                header: web3.utils.fromWei(balance, 'ether'), // convert to eth
                meta:'Balance (ETH)',
                description: 'Remaining amount of money in the fund.'
            }
        ]

        return <Card.Group items={items} />
    }

    render (){
        return (
            <Layout>  
                <h3>Campaign Details</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                         
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm  address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}


export default CampaignDetail