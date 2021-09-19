import React, { Component } from 'react';
import Layout from '../../../components/Layout'
import RequestRows from '../../../components/RequestRows'
import 'semantic-ui-css/semantic.min.css';
import { Card, Grid, Label, Button, Table } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link } from '../../../routes';


class RequestIndex extends Component {
    static async getInitialProps(props){
        const { address } = props.query;
        console.log('address', address); // 'address 0xCD866bc9733fFd885157e3bC27bBf3F4d3120FEE'

        const campaign = Campaign(address);
        const approversCount = await campaign.methods.approversCount().call();

        // get length of requests for the campaign 
        const requestCount = await campaign.methods.geRequestCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        )

        console.log(requests)

        return { address, requestCount, requests, approversCount }; // now we can work with these objects in our component
    }

    componentDidMount() {
        const outerContainer = document.getElementById('__next');
        outerContainer.classList.add('main');
        outerContainer.style.height = "100%"
    }

    // itterate over length of requests return a new row
    renderRows() {
        return this.props.requests.map((request, index) => {
            return (
                <RequestRows
                    request={request}
                    key={index} // key is a part of react. Needed whenever rendering a list of components
                    id={index + 1}
                    address={this.props.address}
                    approversCount = {this.props.approversCount}
                />
            )
        })
    }
  
    render (){
        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>  
              <h2>Requests</h2>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>Create New Request</Button>
                    </a>
                </Link>
                {/* table content */}

                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount (ETH)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div> Found {this.props.requestCount} requests</div>
            </Layout>
        );
    }
}


export default RequestIndex