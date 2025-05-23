import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/clinics_css/clinics_settings.css';
import '../../css/sidebar.css';

//Prej loadConfig.js e merr pathin nga config.yml , edhe me ni enviroment variable e store pathin nUpperCase:
const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_ENDPOINT_CLINICS_SETTINGS}`;

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

const DoctorSettingsForm = ({ doctorProfile, onSave, isLoading, error }) => {
  const [profile, setProfile] = useState(doctorProfile);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage('');
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordError('');
    setSuccessMessage('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side password validation
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

    try {
      const response = await fetch(`${API_BASE_URL}/doctor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const savedProfile = await response.json();
      onSave(savedProfile);
      setSuccessMessage('Ndryshimet u ruajtën me sukses!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setPasswordError('Gabim gjatë ruajtjes së ndryshimeve.');
    }
  };

  return (
      <div className="settings-container">
        <div className="settings-card">
          <h2 className="settings-title">Cilësimet e Mjekut</h2>
          {isLoading ? (
              <p>Duke ngarkuar...</p>
          ) : error ? (
              <p className="error-message">Gabim: {error}</p>
          ) : (
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

                <button type="submit" className="save-button" disabled={isLoading}>
                  <span className="icon">💾</span> Ruaj Ndryshimet
                </button>
              </form>
          )}
        </div>
      </div>
  );
};

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSaveSettings = (updatedProfile) => {
    setDoctorProfile(updatedProfile);
  };

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/doctor`, {
          headers: {
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Failed to fetch doctor profile');
        const data = await response.json();
        setDoctorProfile({
          name: data.name || '',
          email: data.email || '',
          password: '', // Password not returned from API for security
        });
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        setError('Gabim gjatë ngarkimit të profilit të mjekut');
        setDoctorProfile({
          name: 'Dr. Unknown',
          email: '',
          password: '',
        });
      } finally {
        setIsLoading(false);
      }
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
            {isLoading ? (
                <p>Duke ngarkuar...</p>
            ) : error ? (
                <p className="error-message">Gabim: {error}</p>
            ) : (
                <>
                  <h1 className="header-title">Cilësimet</h1>
                  <p className="header-subtitle">Menaxho cilësimet e profilit të mjekut</p>
                </>
            )}
          </div>
          <DoctorSettingsForm
              doctorProfile={doctorProfile}
              onSave={handleSaveSettings}
              isLoading={isLoading}
              error={error}
          />
        </div>
      </div>
  );
};

export default Settings;