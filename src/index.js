// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import Login from './custom-modules/Login';
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import i18n from './i18n';
import HelloFromBackend from './custom-modules/HelloFromBackend';
import Dashboard from './custom-modules/clinics/clinics_dashboard';
import Settings from './custom-modules/clinics/clinics_settings';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/api/hello' element={<HelloFromBackend />} />
          <Route path='/clinics_dashboard' element={<Dashboard />} />
          <Route path='/clinics_settings' element={<Settings />} />
        </Routes>
      </Router>
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();