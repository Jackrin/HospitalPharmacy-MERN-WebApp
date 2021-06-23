import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter as Router, Switch, Route, MemoryRouter, Redirect, useHistory } from "react-router-dom";


ReactDOM.render(
  <MemoryRouter>
    <main style={{overflowY: 'hidden'}}>
      <App />
    </main>
  </MemoryRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
