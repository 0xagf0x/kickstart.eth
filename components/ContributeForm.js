import React, {Component} from "react";
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
    //initialize state object
    state = {
        value: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        
        // spinner turn on and remove any  errors 
        this.setState({loading: true, errorMessage: ''});

        try {
            // get list of accounts
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

         // spinner turn off and reset form 
         this.setState({loading: false, value: ''});

        //redirect user (refresh the page)
        Router.pushRoute(`/campaigns/${this.props.address}`) //homepage
    }


    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input 
                        value={this.state.value}
                        label="ETH"  
                        onChange={event => this.setState({ value: event.target.value })}
                        labelPosition = 'right'
                        placeholder='0'
                    />
                </Form.Field>
                {/* error message  */}
                <Message
                    error
                    header="Whoops"
                    content={this.state.errorMessage}
                />
                <Button primary loading={this.state.loading}>
                    Contribute
                </Button>
            </Form>
        ) 
    }
}

export default ContributeForm;