import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = 'https://react-hooks-c5474.firebaseio.com/';

ReactDOM.render(<App />, document.getElementById('root'));
