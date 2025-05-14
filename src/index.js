<<<<<<< HEAD
/**
 * Fajlli kryesor i aplikacionit qe permban:
 * - Inicializimin e React aplikacionit
 * - Konfigurimin e routing per navigim
 * - Implementimin e i18n per perkthime
 *
 * Modulet e perfshira:
 * - Login: Komponenti per hyrje ne sistem
 * - HelloFromBackend: Testim i lidhjes me backend
 * - Clinics: Menaxhimi i klinikave (dashboard, cilesimet)
 * - Patients: Menaxhimi i pacienteve (dashboard, terminet, profili)
 */

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

// Inicializon elementin baze te aplikacionit
const root = ReactDOM.createRoot(document.getElementById('root'));
=======
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import Login from "./components/pages/Login";
import Swagger from "./components/pages/Swagger";
import "./css/index.css";
import reportWebVitals from "./reportWebVitals";
import i18n from "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
>>>>>>> e2bd9f7530ba452ca702cba307184c9115fc34bf

// Krijon strukturen baze te aplikacionit me routing/paths.
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Router>
        {/* Route/Paths kryesor te aplikacionit */}
        <Routes>
<<<<<<< HEAD
          {/* Faqja e hyrjes */}
          <Route path='/' element={<Login/>}/>
          <Route path='/api/hello' element={<HelloFromBackend/>}/>
          {/* ROute/Path per menaxhimin e klinikave */}
          <Route path='/clinics_dashboard' element={<ClinicsDashboard/>}/>
          <Route path='/clinics_settings' element={<ClinicsSettings/>}/>

          {/* Route/Path per menaxhimin e pacienteve */}
          <Route path='/patients_dashboard' element={<PatientsDashboard />} />
          <Route path='/patients_appointments' element={<PatientsAppointments />} />
          <Route path='/patients_profile' element={<PatientsProfile />} />
=======
          <Route path="/" element={<Login />} />
          <Route path="/test" element={<Swagger />} />
>>>>>>> e2bd9f7530ba452ca702cba307184c9115fc34bf
        </Routes>
      </Router>
    </I18nextProvider>
  </React.StrictMode>,
);

reportWebVitals();
