import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/clinics_css/clinics_dashboard.css';
import '../../css/clinics_css/sidebar.css';
import { recetaMjeksore } from './receta_mjeksore';

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

const PatientList = ({ patients, onSelectPatient }) => (
  <div className="patient-list">
    <h2>Pacientët</h2>
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

  const handleSubmitHistory = (e) => {
    e.preventDefault();
    if (newNotes.trim() && newDate) {
      onAddHistory(patient.id, {
        date: newDate,
        notes: newNotes,
        notesAl: newNotes,
      });
      setNewNotes('');
      setNewDate('');
    }
  };

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const generateXMLPrescription = () => {
    return `
<?xml version="1.0" encoding="UTF-8"?>
<prescription>
  <header>
    <documentType>Recetë për Rrëka / Recept Lekova</documentType>
    <documentNumber>DR${Math.floor(Math.random() * 10000).toString().padStart(4, '0')} DNI ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</documentNumber>
    <date>${prescription.date}</date>
  </header>
  <patient>
    <name>${patient.name}</name>
    <id>${patient.id}</id>
    <address>Placeholder Address</address>
    <insuranceNumber>Placeholder Insurance</insuranceNumber>
  </patient>
  <doctor>
    <name>${doctorName}</name>
    <address>Placeholder Doctor Address</address>
    <signature>Placeholder Signature</signature>
  </doctor>
  <medication>
    <name>${prescription.medication}</name>
    <dosage>${prescription.dosage}</dosage>
    <frequency>${prescription.frequency}</frequency>
    <duration>${prescription.duration}</duration>
    <quantity>Placeholder Quantity</quantity>
    <instructions>Placeholder Instructions</instructions>
  </medication>
  <diagnosis>
    <description>Placeholder Diagnosis</description>
  </diagnosis>
  <allergies>
    ${patient.allergies.map(allergy => `<allergy>${allergyAl[allergy] || allergy}</allergy>`).join('')}
  </allergies>
  <notes>
    <additionalNotes>Placeholder Additional Notes</additionalNotes>
  </notes>
  <footer>
    <totalCost>Placeholder Cost</totalCost>
    <stamp>Placeholder Stamp</stamp>
  </footer>
</prescription>
    `.trim();
  };

  const handleDownloadPrescription = () => {
    const xmlBlob = new Blob([generateXMLPrescription()], { type: 'application/xml' });
    const xmlUrl = URL.createObjectURL(xmlBlob);
    const xmlLink = document.createElement('a');
    xmlLink.href = xmlUrl;
    xmlLink.download = `receta_mjeksore_${patient.id}_${prescription.date}.xml`;
    xmlLink.click();
    URL.revokeObjectURL(xmlUrl);

    const htmlBlob = new Blob([recetaMjeksore(patient, allergyAl, doctorName, prescription)], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = `receta_mjeksore_${patient.id}_${prescription.date}.html`;
    htmlLink.click();
    URL.revokeObjectURL(htmlUrl);
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

const AppointmentList = ({ appointments, onCallNext }) => (
  <div className="appointment-list">
    <h2>Takimet e Ardhshme</h2>
    {appointments.length > 0 ? (
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
  const [doctorName, setDoctorName] = useState('Dr. Endrit');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const handleCallNextPatient = () => {
    if (appointments.length > 0) {
      const nextAppointment = appointments[0];
      const patientName = nextAppointment.patient;

      const newPatient = {
        id: `P${(patients.length + 1).toString().padStart(3, '0')}`,
        name: patientName,
        history: [],
        allergies: [],
        notes: null,
        notesAl: null,
      };

      if (selectedPatient) {
        setPatients([newPatient]);
      } else {
        setPatients([...patients, newPatient]);
      }

      setSelectedPatient(newPatient);
      setAppointments(appointments.slice(1));
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
      const response = [
        {
          id: 'P001',
          name: 'Filan Fisteku',
          history: [
            { date: '2025-03-15', notes: 'Routine checkup, no issues.', notesAl: 'Kontroll rutinë, pa probleme.' },
            { date: '2025-04-01', notes: 'Prescribed antibiotics for infection.', notesAl: 'U përshkruan antibiotikë për infeksion.' },
          ],
          allergies: ['Penicillin', 'Peanuts'],
          notes: 'Patient reports occasional headaches.',
          notesAl: 'Pacienti raporton dhimbje koke të herëpashershme.',
        }
      ];
      setPatients(response);
    };

    const fetchAppointments = async () => {
      const response = [
        { patient: 'Albin Kurti', date: '2025-04-05', time: '11:20:00', notes: '', notesAl: '' },
        { patient: 'Hashim Thaci', date: '2025-04-05', time: '11:20:00', notes: '', notesAl: '' },
        { patient: 'Ramush Haradinaj', date: '2025-04-05', time: '11:20:00', notes: '', notesAl: '' }
      ];
      setAppointments(response);
    };

    const fetchDoctorName = async () => {
      const response = 'Dr. Endrit';
      setDoctorName(response);
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
          <h1 className="header-title">Mirë se vini, {doctorName}</h1>
          <p className="header-subtitle">Përmbledhja e panelit tuaj</p>
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
          <PatientList patients={patients} onSelectPatient={handleSelectPatient} />
          <PatientDetails
            patient={selectedPatient}
            allergyAl={allergyAl}
            onAddHistory={handleAddHistory}
            doctorName={doctorName}
          />
        </div>
        <AppointmentList appointments={appointments} onCallNext={handleCallNextPatient} />
      </div>
    </div>
  );
};

export default Dashboard;