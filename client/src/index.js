import '@polyledger/bootstrap';
import '@polyledger/bootstrap/css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import LayoutContainer from './components/LayoutContainer/LayoutContainer';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<LayoutContainer />, document.getElementById('root'));
registerServiceWorker();
