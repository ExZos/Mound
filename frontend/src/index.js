import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';

import Home from './components/Home';
import Spaces from './components/Spaces';
import Space from './components/Space';
import * as serviceWorker from './serviceWorker';

const history = createBrowserHistory();

const routing = (
  <Router history={history}>
    <Switch>
      <Route path="/s/:id" component={Space} />
      <Route path="/s/" component={Spaces} />
      <Route path="/" component={Home} />
    </Switch>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
