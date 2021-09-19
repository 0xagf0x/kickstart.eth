import React, { Component } from 'react';
import Layout from '../../../components/Layout'
import 'semantic-ui-css/semantic.min.css';
import { Message, Button, Form, Input } from 'semantic-ui-react'
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';


class NewRequest extends Component {

    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false,
        errorMessage: '',
    };

    static async getInitialProps(props){
       const { address } = props.query
       return { address };
    }

    onSubmit = async event => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);
        const { description, value, recipient } = this.state;

        // spinner turn on and remove any  errors 
        this.setState({loading: true, errorMessage: ''});

        try {
            const accounts = await web3.eth.getAccounts();

            //* these args order need to match the order in the createRequest() function in Campaign.sol
            await campaign.methods.createRequest(
            description, 
            web3.utils.toWei(value, 'ether'),
            recipient
            ).send({ from: accounts[0] });

            //redirect user (refresh the page)
            Router.pushRoute(`/campaigns/${this.props.address}/requests`) //homepage

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({loading: false});
    }

    componentDidMount() {
        const outerContainer = document.getElementById('__next');
        outerContainer.classList.add('main');
        outerContainer.style.height = "100%"
    }
  
    render (){
        return (
            <Layout>  
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        <Button>Back</Button>
                    </a>
                </Link>
                <h2>Create A New Request</h2>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description of Request</label>
                        <Input 
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                            placeholder='...'
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value (ETH)</label>
                        <Input 
                            value={this.state.value}
                            onChange={event => this.setState({ value: event.target.value })}
                            label="ETH"  
                            labelPosition = 'right'
                            placeholder='0'
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient Address</label>
                        <Input 
                            value={this.state.recipient}
                            onChange={event => this.setState({ recipient: event.target.value })}
                        />
                    </Form.Field>
                    <Message
                        error
                        header="Whoops, there was an error:"
                        content={this.state.errorMessage}
                    />
                    <Button primary loading={this.state.loading}>Create Request</Button>
                </Form>
             
            </Layout>
        );
    }
}


export default NewRequest