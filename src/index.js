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

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/test" element={<Swagger />} />
        </Routes>
      </Router>
    </I18nextProvider>
  </React.StrictMode>,
);

reportWebVitals();
