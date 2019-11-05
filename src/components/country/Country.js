import React, { Component } from 'react';

// React Boostrap
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

class Country extends Component {

    constructor(props) {
        super(props);

        this.state = {
            [this.props.country.code]: ""
        }

        // Binding the events
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [this.props.country.code]: value
        });
    }

    render() {

        var {country} = this.props;

        return (
            <div className="Country">
                <Form.Group controlId={country.code}>
                    <Form.Label>
                        <span className={"mr-2 flag-icon " + country.flag}/>
                        {country.name}
                    </Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">{country.currency}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="number" name={country.code} step="0.001" autoComplete="off" value={this.state[country.code]} onChange={this.handleChange}/>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        {`${country.currency} ${country.minimumWage} per ${country.payPeriod}`}
                    </Form.Text>
                </Form.Group>
                <hr/>
            </div>
        );
    }
}

export default Country;
