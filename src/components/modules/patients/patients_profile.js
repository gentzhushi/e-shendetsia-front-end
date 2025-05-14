import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/patients_css/patients_profile.css';
import '../../css/sidebar.css';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      document.querySelector('.toggle-button').click();
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
            { label: 'Përmbledhje', path: '/patients_dashboard' },
            { label: 'Takimet', path: '/patients_appointments' },
            { label: 'Profili', path: '/patients_profile' },
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

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    id: '',
    email: '',
    phone: '',
    address: '',
    allergies: [],
    emergencyContact: { name: '', phone: '' },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newAllergy, setNewAllergy] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const allergyAl = {
    Penicillin: 'Penicilinë',
    Peanuts: 'Kikirikë',
    Latex: 'Lateks',
    Shellfish: 'Fruta Deti',
  };

  const commonAllergies = ['Penicillin', 'Peanuts', 'Latex', 'Shellfish', 'Pollen', 'Dust Mites'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/patient/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT auth
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile({
          name: data.name || '',
          id: data.id || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          allergies: Array.isArray(data.allergies) ? data.allergies : [],
          emergencyContact: {
            name: data.emergencyContact?.name || '',
            phone: data.emergencyContact?.phone || '',
          },
        });
      } catch (err) {
        setError('Error fetching profile data');
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('emergencyContact.')) {
      const field = name.split('.')[1];
      setProfile((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !profile.allergies.includes(newAllergy)) {
      setProfile((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy],
      }));
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (allergy) => {
    setProfile((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/patient/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      console.log('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError('Error updating profile');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <div className="profile-container">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? '✖' : '☰'}
          </button>
          <div className="header">
            <h1 className="header-title">Profili Juaj</h1>
            <p className="header-subtitle">Menaxhoni të dhënat personale dhe shëndetësore</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="profile-section">
            <div className={`profile-card ${isEditing ? 'editing' : ''}`}>
              {isEditing ? (
                  <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                      <label htmlFor="name">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Emri:
                      </label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          value={profile.name}
                          onChange={handleInputChange}
                          className="profile-input"
                          required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                        Email:
                      </label>
                      <input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={handleInputChange}
                          className="profile-input"
                          required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Telefoni:
                      </label>
                      <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={handleInputChange}
                          className="profile-input"
                          required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Adresa:
                      </label>
                      <input
                          id="address"
                          name="address"
                          type="text"
                          value={profile.address}
                          onChange={handleInputChange}
                          className="profile-input"
                          required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="emergencyContact.name">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Kontakti i Emergjencës (Emri):
                      </label>
                      <input
                          id="emergencyContact.name"
                          name="emergencyContact.name"
                          type="text"
                          value={profile.emergencyContact.name}
                          onChange={handleInputChange}
                          className="profile-input"
                          required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="emergencyContact.phone">
                        <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Kontakti i Emergjencës (Telefoni):
                      </label>
                      <input
                          id="emergencyContact.phone"
                          name="emergencyContact.phone"
                          type="tel"
                          value={profile.emergencyContact.phone}
                          onChange={handleInputChange}
                          className="profile-input"
                          required
                      />
                    </div>
                    <div className="allergy-section">
                      <h3>Alergjitë</h3>
                      <div className="allergy-input">
                        <select
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            className="profile-input"
                        >
                          <option value="">Zgjidh ose shkruaj alergji</option>
                          {commonAllergies.map((allergy) => (
                              <option key={allergy} value={allergy}>
                                {allergyAl[allergy] || allergy}
                              </option>
                          ))}
                        </select>
                        <input
                            type="text"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            placeholder="Ose shkruaj alergji të re"
                            className="profile-input"
                        />
                        <button
                            type="button"
                            className="add-allergy-button"
                            onClick={handleAddAllergy}
                            disabled={!newAllergy.trim()}
                        >
                          Shto
                        </button>
                      </div>
                      {profile.allergies.length > 0 ? (
                          <div className="allergy-list">
                            {profile.allergies.map((allergy, index) => (
                                <span key={index} className="allergy-tag">
                          {allergyAl[allergy] || allergy}
                                  <button
                                      type="button"
                                      className="remove-allergy-button"
                                      onClick={() => handleRemoveAllergy(allergy)}
                                  >
                            ✕
                          </button>
                        </span>
                            ))}
                          </div>
                      ) : (
                          <p className="no-allergies">Nuk ka alergji të regjistruara.</p>
                      )}
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="accent-button save-button" disabled={isSaving}>
                        {isSaving ? 'Duke Ruajtur...' : 'Ruaj'}
                      </button>
                      <button
                          type="button"
                          className="cancel-button"
                          onClick={() => setIsEditing(false)}
                          disabled={isSaving}
                      >
                        Anulo
                      </button>
                    </div>
                  </form>
              ) : (
                  <div className="profile-details">
                    <p><strong>Emri:</strong> {profile.name}</p>
                    <p><strong>ID:</strong> {profile.id}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Telefoni:</strong> {profile.phone}</p>
                    <p><strong>Adresa:</strong> {profile.address}</p>
                    <h3>Kontakti i Emergjencës</h3>
                    <p><strong>Emri:</strong> {profile.emergencyContact.name}</p>
                    <p><strong>Telefoni:</strong> {profile.emergencyContact.phone}</p>
                    <h3>Alergjitë</h3>
                    {profile.allergies.length > 0 ? (
                        <div className="allergy-list">
                          {profile.allergies.map((allergy, index) => (
                              <span key={index} className="allergy-tag">
                        {allergyAl[allergy] || allergy}
                      </span>
                          ))}
                        </div>
                    ) : (
                        <p className="no-allergies">Nuk ka alergji të regjistruara.</p>
                    )}
                    <div className="edit-button-container">
                      <button
                          className="accent-button edit-button"
                          onClick={() => setIsEditing(true)}
                      >
                        Modifiko Profilin
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;