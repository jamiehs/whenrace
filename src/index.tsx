import React from 'react';
import ReactDOM from 'react-dom/client';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import './index.scss';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
        <Switch>
            <Route path="/:selected_series?">
                <App />
            </Route>
        </Switch>
    </Router>
  </React.StrictMode>
);
