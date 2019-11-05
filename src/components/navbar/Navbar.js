import React, { Component } from 'react';

// React Boostrap
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import './Navbar.css';

class NavigationBar extends Component {

    render() {
        return (
            <div>
                <Navbar fixed="top" className="navbar-custom" expand="lg">
                    <Navbar.Brand href={process.env.PUBLIC_URL+"/"}>Compare Prices Among Countries</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href={process.env.PUBLIC_URL+"/home"}>Home</Nav.Link>
                            <Nav.Link target="_blank" href="https://github.com/thiagodnf/compare-prices-among-countries/wiki/Examples">Examples</Nav.Link>
                            <Nav.Link target="_blank" href="https://github.com/thiagodnf/compare-prices-among-countries">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default NavigationBar;
