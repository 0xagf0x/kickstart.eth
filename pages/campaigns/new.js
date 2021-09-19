// since this will be a Class-based component, we need to import Component
import React, { Component }  from 'react';
import Layout from '../../components/Layout'
import 'semantic-ui-css/semantic.min.css';
import { Form, Button, Input, Message } from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3';

//helpers for routing
import { Link, Router } from '../../routes';;

// Class based component
class CampaignNew extends Component {

    componentDidMount() {
        const outerContainer = document.getElementById('__next');
        outerContainer.classList.add('main');
        outerContainer.style.height = "100%"
    }

    state = {
        minimumContribution: '',  // this.state.minimumContribution
        errorMessage: '', // form validatins
        loading: false, // for the Submit function spinner


    }

    //* this submitform function:
        // prevents defaul action from happening
        // gets accounts
        // creates a new campaign instance with the 'minimumContribution' argument we declared in the Solidity code
    onSubmit = async (e)  => {
        e.preventDefault();

        this.setState({ loading: true, errorMessage:'' }) // add spinner and remove any old errors

        // validation for form submission
        try {
            const accounts = await web3.eth.getAccounts();
            //pull in the createCampain function from our ethereum foldertry
            await factory.methods.createCampaign(this.state.minimumContribution)
            .send({
                // get accounts from web3
                from: accounts[0],
            })

            //redirect user 
            Router.pushRoute('/') //homepage
        } catch (err) {
            // if fails, update the state of the Error Message
            this.setState({ errorMessage: err.message });
        }

        this.setState({loading: false})
    }

    render () {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} >
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                        label="WEI"  
                        labelPosition = 'right'
                        value={this.state.minimumContribution}
                        // placeholder={this.state.minimumContribution}
                        onChange={event => this.setState({ minimumContribution: event.target.value })}
                        />
                    </Form.Field>
                    <Button 
                    primary
                    loading={this.state.loading}
                    > Create </Button>

                    <Message
                        error
                        header="Whoops"
                        content={this.state.errorMessage}
                    />
                </Form>
            </Layout>
        )
    }
}

export default CampaignNew