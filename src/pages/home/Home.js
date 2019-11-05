import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import $ from 'jquery';

// React Boostrap
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'

import Navbar from '../../components/navbar/Navbar';
import Country from '../../components/country/Country';

import './Home.css';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            countries: []
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){

        fetch(`${process.env.PUBLIC_URL}/data/countries.json`)
            .then(res => res.json())
            .then((result) => {
                result.sort((a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (b.name > a.name) {
                        return -1;
                    }
                    return 0;
                });
                this.setState({
                    countries: result
                });
            }).catch((error) => {
                console.log(error);
            });
    }

    handleSubmit(event) {
        $(event.target)
            .find('input[name]')
            .filter(function () {
                console.log(this.value)
                return !this.value;
            })
            .prop('name', '');
    }

    render() {

        console.log(this.state)
        return (
            <div className="Home">
                <Navbar/>
                <Container fluid="true">
                    <Card className="rounded mb-3">
                        <Card.Body>
                            <Form action="/compare-prices-among-countries/compare" onSubmit={this.handleSubmit} autoComplete="off">
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control type="text" name="productName" autoComplete="off" autoFocus required/>
                                </Form.Group>
                                <hr/>
                                {this.state.countries.map((country, key ) => {
                                    return (
                                        <Country key={key} country={country}/>
                                    )
                                })}
                                <Button variant="success" type="submit">Compare</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        );
    }
}

export default Home;
