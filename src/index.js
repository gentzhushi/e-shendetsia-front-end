import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './custom-modules/Login';

import './css/index.css';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

/*

TODO:
1. me bo me router (mos mu refresh nmes t hrefave)
// gjithqysh kqyre Link per router se sbon me href 
  
*/


// kqyre session, nese null, bire qitu
root.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);
// nese jo, qoje te home

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
