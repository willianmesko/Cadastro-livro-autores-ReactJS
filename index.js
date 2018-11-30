import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Router, Route, browserHistory,IndexRoute} from 'react-router';
import AutorBox from './Autor';
import LivroBox from './Livro';
import Home from './Home';
ReactDOM.render(
   ( <Router history={browserHistory}>
    <Route path="/" component={App}>
        <IndexRoute path="/" component={Home}/>
        <Route path="/autor" component={AutorBox}/>
        <Route path="/livro" component={LivroBox} />
    </Route>

    </Router>),
    
    document.getElementById('root')
);
serviceWorker.unregister();