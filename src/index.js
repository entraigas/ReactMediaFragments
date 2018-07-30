import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import App from './App';
import registerServiceWorker from './config/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
