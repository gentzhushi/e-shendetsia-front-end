import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/clinics_css/clinics_dashboard.css';
import '../../css/sidebar.css';
import { recetaMjeksore } from './receta_mjeksore';
import html2pdf from 'html2pdf.js';

// Base URL e API (DUHET ME NDRYSHU ME URL AKTUALE TAPI TON):
const API_BASE_URL = 'https://localhost:8080/api/clinics_dashboard';

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

const StatCard = ({ title, value, type, icon }) => (
    <div className={`stat-card ${type}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{value}</p>
      </div>
    </div>
);

const PatientList = ({ patients, onSelectPatient, isLoading, error }) => (
    <div className="patient-list">
      <h2>Pacientët</h2>
      {isLoading ? (
          <p>Duke ngarkuar...</p>
      ) : error ? (
          <p className="error">Gabim: {error}</p>
      ) : patients.length === 0 ? (
          <p>Nuk ka pacientë të disponueshëm.</p>
      ) : (
          <div className="patients-list">
            {patients.map((patient) => (
                <div
                    key={patient.id}
                    className="patient-item"
                    onClick={() => onSelectPatient(patient)}
                >
                  <div className="patient-avatar">{patient.name[0]}</div>
                  <div className="patient-info">
                    <p className="name">{patient.name}</p>
                    <p className="id">ID: {patient.id}</p>
                  </div>
                </div>
            ))}
          </div>
      )}
    </div>
);

const PatientDetails = ({ patient, allergyAl, onAddHistory, doctorName }) => {
  const [newNotes, setNewNotes] = useState('');
  const [newDate, setNewDate] = useState('');
  const [prescription, setPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
  });

  if (!patient) return <div className="patient-details">Zgjidh një pacient për të parë detajet</div>;

  const handleSubmitHistory = async (e) => {
    e.preventDefault();
    if (newNotes.trim() && newDate) {
      try {
        const response = await fetch(`${API_BASE_URL}/patients/${patient.id}/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            date: newDate,
            notes: newNotes,
            notesAl: newNotes,
          }),
        });
        if (!response.ok) throw new Error('Failed to add history');
        const newHistoryEntry = await response.json();
        onAddHistory(patient.id, newHistoryEntry);
        setNewNotes('');
        setNewDate('');
      } catch (error) {
        console.error('Error adding history:', error);
        alert('Gabim gjatë shtimit të historisë');
      }
    }
  };

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadPrescription = () => {
    const htmlContent = recetaMjeksore(patient, allergyAl, doctorName, prescription);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);

    const opt = {
      margin: 10,
      filename: `receta_mjeksore_${patient.id}_${prescription.date}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // eslint-disable-next-line no-undef
    html2pdf().set(opt).from(tempDiv).save().then(() => {
      document.body.removeChild(tempDiv);
    });
  };

  return (
      <div className="patient-details">
        <h2>Profili i {patient.name}</h2>
        <div className="details-section">
          <h3>Historia e Pacientit</h3>
          {patient.history.length > 0 ? (
              <ul>
                {patient.history.map((visit, index) => (
                    <li key={index}>
                      {visit.date}: {visit.notesAl}
                    </li>
                ))}
              </ul>
          ) : (
              <p>Nuk ka histori të disponueshme.</p>
          )}
          <form onSubmit={handleSubmitHistory} className="add-history-form">
            <h3>Shto Histori të Re</h3>
            <label htmlFor="history-date">Data e Kontrollit:</label>
            <input
                id="history-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="history-date-input"
                required
            />
            <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Shkruaj shënime për kontrollin e fundit..."
                rows="4"
                className="history-input"
                required
            />
            <button type="submit" className="accent-button submit-history-button" disabled={!newNotes.trim() || !newDate}>
              Shto në Histori
            </button>
          </form>
        </div>
        <div className="details-section">
          <h3>Alergjitë</h3>
          {patient.allergies.length > 0 ? (
              <ul>
                {patient.allergies.map((allergy, index) => (
                    <li key={index}>{allergyAl[allergy] || allergy}</li>
                ))}
              </ul>
          ) : (
              <p>Nuk ka alergji të regjistruara.</p>
          )}
        </div>
        <div className="details-section">
          <h3>Shto Recetë të Re</h3>
          <form className="prescription-form">
            <label htmlFor="medication">Medikamenti:</label>
            <input
                id="medication"
                name="medication"
                type="text"
                value={prescription.medication}
                onChange={handlePrescriptionChange}
                placeholder="Emri i medikamentit"
                className="prescription-input"
                required
            />
            <label htmlFor="dosage">Dozimi:</label>
            <input
                id="dosage"
                name="dosage"
                type="text"
                value={prescription.dosage}
                onChange={handlePrescriptionChange}
                placeholder="p.sh. 500 mg"
                className="prescription-input"
                required
            />
            <label htmlFor="frequency">Frekuenca:</label>
            <input
                id="frequency"
                name="frequency"
                type="text"
                value={prescription.frequency}
                onChange={handlePrescriptionChange}
                placeholder="p.sh. 2 herë në ditë"
                className="prescription-input"
                required
            />
            <label htmlFor="duration">Kohëzgjatja:</label>
            <input
                id="duration"
                name="duration"
                type="text"
                value={prescription.duration}
                onChange={handlePrescriptionChange}
                placeholder="p.sh. 7 ditë"
                className="prescription-input"
                required
            />
            <label htmlFor="prescription-date">Data:</label>
            <input
                id="prescription-date"
                name="date"
                type="date"
                value={prescription.date}
                onChange={handlePrescriptionChange}
                className="prescription-input"
                required
            />
            <button
                type="button"
                className="accent-button submit-prescription-button"
                onClick={handleDownloadPrescription}
                disabled={!prescription.medication.trim() || !prescription.dosage.trim() || !prescription.frequency.trim() || !prescription.duration.trim() || !prescription.date}
            >
              Shkarko Recetën
            </button>
          </form>
        </div>
        <div className="details-section">
          <h3>Shënime të Fundit</h3>
          {patient.notesAl ? <p>{patient.notesAl}</p> : <p>Nuk ka shënime të fundit.</p>}
        </div>
      </div>
  );
};

const AppointmentList = ({ appointments, onCallNext, isLoading, error }) => (
    <div className="appointment-list">
      <h2>Takimet e Ardhshme</h2>
      {isLoading ? (
          <p>Duke ngarkuar...</p>
      ) : error ? (
          <p className="error">Gabim: {error}</p>
      ) : appointments.length > 0 ? (
          <>
            <button
                className="accent-button call-next-button"
                onClick={onCallNext}
            >
              Thirr Pacientin e Rradhës
            </button>
            <div className="appointments-list">
              {appointments.map((appointment, index) => (
                  <div key={index} className="appointment-item">
                    <div className="appointment-info">
                      <p className="patient">Pacient: {appointment.patient}</p>
                      <p className="date">Data: {appointment.date}</p>
                      <p className="time">Ora: {appointment.time}</p>
                      <p className="notes">Shënime: {appointment.notesAl || 'Asnjë'}</p>
                    </div>
                  </div>
              ))}
            </div>
          </>
      ) : (
          <p className="no-appointments">Nuk ka pacientë në pritje.</p>
      )}
    </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingAppointments: 0,
  });
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorName, setDoctorName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState({
    patients: false,
    appointments: false,
    doctor: false,
  });
  const [error, setError] = useState({
    patients: null,
    appointments: null,
    doctor: null,
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const allergyAl = {
    Penicillin: 'Penicilinë',
    Peanuts: 'Kikirikë',
    Latex: 'Lateks',
    Shellfish: 'Fruta Deti',
  };

  const calculateStats = () => {
    const totalPatients = patients.length;
    const pendingAppointments = appointments.length;

    setStats({
      totalPatients,
      pendingAppointments,
    });
  };

  const handleCallNextPatient = async () => {
    if (appointments.length > 0) {
      const nextAppointment = appointments[0];
      const patientName = nextAppointment.patient;

      try {
        const response = await fetch(`${API_BASE_URL}/patients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: patientName,
            history: [],
            allergies: [],
            notes: null,
            notesAl: null,
          }),
        });
        if (!response.ok) throw new Error('Failed to create patient');
        const newPatient = await response.json();

        if (selectedPatient) {
          setPatients([newPatient]);
        } else {
          setPatients([...patients, newPatient]);
        }

        setSelectedPatient(newPatient);
        setAppointments(appointments.slice(1));

        // Optionally delete the appointment from the backend
        await fetch(`${API_BASE_URL}/appointments/${nextAppointment.id}`, {
          method: 'DELETE',
          headers: {
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });
      } catch (error) {
        console.error('Error calling next patient:', error);
        setError((prev) => ({ ...prev, patients: 'Gabim gjatë shtimit të pacientit' }));
      }
    }
  };

  const handleAddHistory = (patientId, newHistoryEntry) => {
    setPatients(patients.map((patient) =>
        patient.id === patientId
            ? { ...patient, history: [...patient.history, newHistoryEntry] }
            : patient
    ));

    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient({
        ...selectedPatient,
        history: [...selectedPatient.history, newHistoryEntry],
      });
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading((prev) => ({ ...prev, patients: true }));
      setError((prev) => ({ ...prev, patients: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/patients`, {
          headers: {
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Failed to fetch patients');
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError((prev) => ({ ...prev, patients: 'Gabim gjatë ngarkimit të pacientëve' }));
      } finally {
        setIsLoading((prev) => ({ ...prev, patients: false }));
      }
    };

    const fetchAppointments = async () => {
      setIsLoading((prev) => ({ ...prev, appointments: true }));
      setError((prev) => ({ ...prev, appointments: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
          headers: {
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError((prev) => ({ ...prev, appointments: 'Gabim gjatë ngarkimit të takimeve' }));
      } finally {
        setIsLoading((prev) => ({ ...prev, appointments: false }));
      }
    };

    const fetchDoctorName = async () => {
      setIsLoading((prev) => ({ ...prev, doctor: true }));
      setError((prev) => ({ ...prev, doctor: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/doctor`, {
          headers: {
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Failed to fetch doctor name');
        const data = await response.json();
        setDoctorName(data.name || 'Dr. Unknown');
      } catch (error) {
        console.error('Error fetching doctor name:', error);
        setError((prev) => ({ ...prev, doctor: 'Gabim gjatë ngarkimit të emrit të doktorit' }));
        setDoctorName('Dr. Unknown');
      } finally {
        setIsLoading((prev) => ({ ...prev, doctor: false }));
      }
    };

    fetchPatients();
    fetchAppointments();
    fetchDoctorName();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [patients, appointments]);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  return (
      <div className="dashboard-container">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <button className="toggle-button" onClick={toggleSidebar}>
            {isSidebarOpen ? '✖' : '☰'}
          </button>
          <div className="header">
            {isLoading.doctor ? (
                <p>Duke ngarkuar...</p>
            ) : error.doctor ? (
                <p className="error">Gabim: {error.doctor}</p>
            ) : (
                <>
                  <h1 className="header-title">Mirë se vini, {doctorName}</h1>
                  <p className="header-subtitle">Përmbledhja e panelit tuaj</p>
                </>
            )}
          </div>
          <div className="stats-container">
            <StatCard
                title="Total Pacientëve"
                value={stats.totalPatients}
                type="patients"
                icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            />
            <StatCard
                title="Takime në Pritje"
                value={stats.pendingAppointments}
                type="pending"
                icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>
          <div className="content-sections">
            <PatientList
                patients={patients}
                onSelectPatient={handleSelectPatient}
                isLoading={isLoading.patients}
                error={error.patients}
            />
            <PatientDetails
                patient={selectedPatient}
                allergyAl={allergyAl}
                onAddHistory={handleAddHistory}
                doctorName={doctorName}
            />
          </div>
          <AppointmentList
              appointments={appointments}
              onCallNext={handleCallNextPatient}
              isLoading={isLoading.appointments}
              error={error.appointments}
          />
        </div>
      </div>
  );
};

export default Dashboard;