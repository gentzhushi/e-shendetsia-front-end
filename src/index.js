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

import ClinicsDashboard from './custom-modules/clinics/clinics_dashboard';
import ClinicsSettings from './custom-modules/clinics/clinics_settings';

import PatientsDashboard from './custom-modules/patients/patients_dashboard';
import PatientsAppointments from './custom-modules/patients/patients_appointments';
import PatientsProfile from './custom-modules/patients/patients_profile';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/api/hello' element={<HelloFromBackend />} />
          <Route path='/clinics_dashboard' element={<ClinicsDashboard />} />
          <Route path='/clinics_settings' element={<ClinicsSettings />} />

          <Route path='/patients_dashboard' element={<PatientsDashboard />} />
          <Route path='/patients_appointments' element={<PatientsAppointments />} />
          <Route path='/patients_profile' element={<PatientsProfile />} />
        </Routes>
      </Router>
    </I18nextProvider>
  </React.StrictMode>
);

reportWebVitals();