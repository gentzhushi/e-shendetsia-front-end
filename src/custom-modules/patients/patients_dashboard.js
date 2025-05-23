import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/patients_css/patients_dashboard.css';
import '../../css/sidebar.css';

// Base URL for API (replace with your actual API URL)
const API_BASE_URL = 'https://api.e-shendetesia.com';

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

const HistoryCard = ({ visit }) => (
    <div className="history-card">
      <div className="history-header">
        <p className="date">{visit.date}</p>
        <p className="doctor">{visit.doctor}</p>
      </div>
      <div className="history-details">
        <p><strong>Diagnoza:</strong> {visit.diagnosis || 'Nuk është specifikuar'}</p>
        <p><strong>Shënime:</strong> {visit.notesAl || 'Asnjë shënim'}</p>
        <p><strong>Trajtimi:</strong> {visit.treatment || 'Asnjë trajtim'}</p>
      </div>
    </div>
);

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/patient/history`, {
          headers: {
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Failed to fetch medical history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching medical history:', error);
        setError('Gabim gjatë ngarkimit të historikut mjekësor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter((visit) =>
      (visit.diagnosis?.toLowerCase() || '').includes(filter.toLowerCase()) ||
      (visit.notesAl?.toLowerCase() || '').includes(filter.toLowerCase()) ||
      (visit.doctor?.toLowerCase() || '').includes(filter.toLowerCase())
  );

  return (
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? '✖' : '☰'}
          </button>
          <div className="header">
            <h1 className="header-title">Historiku Mjekësor</h1>
            <p className="header-subtitle">Shikoni vizitat dhe trajtimet tuaja të kaluara</p>
          </div>
          <div className="filter-section">
            <input
                type="text"
                placeholder="Kërko sipas diagnozës, mjekut ose shënimeve..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-input"
                disabled={isLoading}
            />
          </div>
          <div className="history-section">
            <h2>Vizitat e Kaluara</h2>
            {isLoading ? (
                <p>Duke ngarkuar...</p>
            ) : error ? (
                <p className="error-message">Gabim: {error}</p>
            ) : filteredHistory.length > 0 ? (
                <div className="history-list">
                  {filteredHistory.map((visit, index) => (
                      <HistoryCard key={index} visit={visit} />
                  ))}
                </div>
            ) : (
                <p className="no-data">Nuk u gjetën të dhëna për historikun tuaj.</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;