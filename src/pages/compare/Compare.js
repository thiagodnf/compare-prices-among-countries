import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import queryString from 'query-string-es5';

// React Boostrap
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'

import Navbar from '../../components/navbar/Navbar';
import Time from '../../utils/Time'

class Compare extends Component {

    state = {
        product: {
            productName: "",
            times: []
        }
    }

    componentDidMount(){

        fetch("/data/countries.json")
            .then(res => res.json())
            .then((result) => {

                var url = queryString.parse(this.props.location.search);

                this.setState({
                    product: Time.calculateTimes(url, result)
                });
            }).catch((error) => {
                console.log(error);
            });
    }

    render() {

        return (
            <div className="Compare">
                <Navbar/>
                <Container fluid="true">
                    <Card className="rounded mb-5">
                        <Card.Body>
                            <h2 className="mb-4">{this.state.product.productName}</h2>
                            <table className="table">
                                <tbody>
                                {this.state.product.times.map((time, key ) => {

                                    var size = (time.timeInDays / this.state.product.maxDays) * 100;

                                    return (
                                        <tr key={key}>
                                            <td>
                                                <span className={"mr-2 flag-icon "+time.country.flag}/>
                                                {time.country.name}
                                            </td>
                                            <td>
                                                <ProgressBar now={size.toFixed(1)} label={`${time.timeInDays.toFixed(1)} days`} />
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                            <Button variant="primary" href="/compare-prices-among-countries">Back</Button>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        );
    }
}

export default Compare;
