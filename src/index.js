import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import "flag-icon-css/css/flag-icon.min.css";


import Home from './pages/home/Home';
import Compare from './pages/compare/Compare';

import './index.css';

const routing = (
    <Router>
        <div>
            <Route path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/compare" component={Compare} />
        </div>
    </Router>
)

ReactDOM.render(
    routing,
    document.getElementById('root')
);
