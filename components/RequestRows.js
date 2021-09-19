import React, { Component } from 'react';
import { render } from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { Button, Icon, Table } from 'semantic-ui-react'
import { Link } from '../routes';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';


class RequestRows extends Component {

    state = {
        loading: false,
        loadingFinalize: false,
        errorMessage: '',
    };


    onApprove = async () => {
        // console.log(this.props.id - 1)
        this.setState({loading: true});
        
        // get address from campaign contract
        const campaign = Campaign(this.props.address);
        // get list of accounts
        const accounts = await web3.eth.getAccounts();
        // call our approveRequest function from the solidity contract + send 
        await campaign.methods.approveRequest(this.props.id - 1).send({
            from: accounts[0],
        });

        this.setState({loading: false});
    }

    onFinalize = async () => {
        this.setState({loadingFinalize: true});

        // get address from campaign contract
        const campaign = Campaign(this.props.address);
         // get list of accounts
        const accounts = await web3.eth.getAccounts();
        // call our approveRequest function from the solidity contract + send 
        await campaign.methods.finalizeRequest(this.props.id - 1).send({
            from: accounts[0],
        });

        this.setState({loadingFinalize: false});
    }

    render() {
        const {Row, Cell} = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount >  approversCount / 2;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}> 
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount} / {approversCount}</Cell>
                <Cell>
                    {/* if enough votes, hide the button */}
                    {request.complete ?  
                    <Icon 
                    name='checkmark' 
                    color='green'
                    disabled
                    /> : (
                        <Button color="green" basic onClick={this.onApprove} loading={this.state.loading}>Approve</Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? 
                      <Icon 
                      name='checkmark' 
                      color='green'
                      disabled
                      /> 
                    : (
                        <Button color="teal" onClick={this.onFinalize} loading={this.state.loadingFinalize}>Finalize</Button>
                    )}
                </Cell>
            </Row>
        )
    }
};
export default RequestRows;





