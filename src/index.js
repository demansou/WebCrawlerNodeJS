import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import './index.css';
import Home from './Home';
import Visualization from './Visualization';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
       <IndexRoute component={Home} />
       <Route path="/visualization" component={Visualization}/>
    </Route>
  </Router>
), document.getElementById('root'));
