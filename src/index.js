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
            <Route exact path={process.env.PUBLIC_URL + '/'} component={Home} />
            <Route exact path={process.env.PUBLIC_URL + "/home"} component={Home} />
            <Route path={process.env.PUBLIC_URL + "/compare"} component={Compare} />
        </div>
    </Router>
)

ReactDOM.render(
    routing,
    document.getElementById('root')
);
