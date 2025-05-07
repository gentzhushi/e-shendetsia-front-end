import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/clinics_css/clinics_settings.css';
import '../../css/clinics_css/sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

   return (
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <h1>e-shendetesia</h1>
        <ul>
          {[
            { label: 'Faqja Kryesore', path: '/clinics_dashboard' },
            { label: 'Settings', path: '/clinics_settings' },
          ].map((item) => (
            <li key={item.label} onClick={() => handleNavigation(item.path)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              {item.label}
            </li>
          ))}
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Dil
        </button>
      </div>
    );
  };

const DoctorSettingsForm = ({ doctorProfile, onSave }) => {
  const [profile, setProfile] = useState(doctorProfile);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage(''); // Clear success message on change
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordError('');
    setSuccessMessage(''); // Clear success message on change
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
    setSuccessMessage(''); // Clear success message on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic password validation
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError('Fjalëkalimet nuk përputhen.');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setPasswordError('Fjalëkalimi duhet të jetë të paktën 8 karaktere i gjatë.');
      return;
    }

    const updatedProfile = { ...profile };
    if (newPassword) {
      updatedProfile.password = newPassword;
    }

    onSave(updatedProfile);
    setSuccessMessage('Ndryshimet u ruajtën me sukses!');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">Cilësimet e Mjekut</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-section">
            <h3 className="section-title">Profili i Mjekut</h3>
            <div className="form-group">
              <label htmlFor="doctorName">
                <span className="icon">👤</span> Emri i Mjekut:
              </label>
              <input
                id="doctorName"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Emri i mjekut"
                className="settings-input"
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="doctorEmail">
                <span className="icon">📧</span> Email:
              </label>
              <input
                id="doctorEmail"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Email i mjekut"
                className="settings-input"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Ndrysho Fjalëkalimin</h3>
            <div className="form-group">
              <label htmlFor="newPassword">
                <span className="icon">🔒</span> Fjalëkalimi i Ri:
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Fjalëkalimi i ri"
                className="settings-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <span className="icon">🔐</span> Konfirmo Fjalëkalimin:
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Konfirmo fjalëkalimin"
                className="settings-input"
              />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>

          <button type="submit" className="save-button">
            <span className="icon">💾</span> Ruaj Ndryshimet
          </button>
        </form>
      </div>
    </div>
  );
};

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState({
    name: 'Dr. Endrit',
    email: 'endrit@example.com',
    password: '********', // Placeholder for the current password (not shown in UI)
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSaveSettings = (updatedProfile) => {
    setDoctorProfile(updatedProfile);
  };

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      // Simulate fetching the doctor's profile from a backend
      const response = {
        name: 'Dr. Endrit',
        email: 'endrit@example.com',
        password: '********', // Placeholder
      };
      setDoctorProfile(response);
    };

    fetchDoctorProfile();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarOpen ? '✖' : '☰'}
        </button>
        <div className="header">
          <h1 className="header-title">Cilësimet</h1>
          <p className="header-subtitle">Menaxho cilësimet e profilit të mjekut</p>
        </div>
        <DoctorSettingsForm
          doctorProfile={doctorProfile}
          onSave={handleSaveSettings}
        />
      </div>
    </div>
  );
};

export default Settings;