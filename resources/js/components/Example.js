import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

//import '../css/app.css';
// or less ideally
import TransferForm from './TransferForm'
import TransferList from './TransferList'


/* Par acambiar la url por que tiene que ser dinamico */
import url from '../url';

export default class Example extends Component {

    constructor(props){
        super(props)

        this.state= {
            money: 0.0,
            transfers:[],
            error:null,
            form: {
                description: '',
                amount: '',
                wallet_id: 1
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    async handleSubmit(e){
        e.preventDefault()
        //console.log('Sending....')
        try {
            let config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.form)
            }
            console.log(this.state.form)
            let res= await fetch(`${url}/api/transfer`,config)
            let data = await res.json()

            //console.log(Number.isInteger(this.state.money))
            this.setState({
                transfers: this.state.transfers.concat(data),
                money: (parseInt(this.state.money)) + (parseInt(data.amount))
            })
        } catch (error) {
            this.setState({
                error
            })
        }
    }

    handleChange(e){
        //console.log(e.target.value)
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]:e.target.value
            }
        })
    }

    async componentDidMount(){
        try{
            let res= await fetch(`${url}/api/wallet`)
            let data = await res.json()
            //console.log(data)
            this.setState({
                money: data.money,
                transfers: data.transfers              
            })
        } catch (error) {
            this.setState({
                error
            })
        }
        
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-12 m-t-md">
                        <p className="title">$ { this.state.money }</p>
                    </div>
                    <div className="col-md-12">
                        <TransferForm
                            form= {this.state.form}
                            onChange={this.handleChange}
                            onSubmit={this.handleSubmit}
                        />
                    </div>
                </div>
                <div className="m-t-md">
                    <TransferList
                        transfers={this.state.transfers}                        
                    />
                </div>
            </div>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
