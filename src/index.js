import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import Login from './custom-modules/Login';
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import i18n from './i18n';
import HelloFromBackend from './custom-modules/HelloFromBackend';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/api/hello' element={<HelloFromBackend />} />
        </Routes>
      </Router>
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();