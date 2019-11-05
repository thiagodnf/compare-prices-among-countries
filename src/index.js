import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from "history";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import "flag-icon-css/css/flag-icon.min.css";

import Home from './pages/home/Home';
import Compare from './pages/compare/Compare';

import './index.css';

const history = createBrowserHistory();

const routing = (
    <Router history={history} basename={process.env.PUBLIC_URL}>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/compare" component={Compare} />
            <Route component={() => (<div>404 Not found </div>)} />
        </Switch>
    </Router>
)

console.log("process.env.PUBLIC_URL", process.env.PUBLIC_URL);

ReactDOM.render(
    routing,
    document.getElementById('root')
);
