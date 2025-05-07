import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/patients_css/patients_appointments.css';
import '../../css/clinics_css/sidebar.css';

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

const HospitalCard = ({ hospital, onSelect }) => (
  <div className="hospital-card" onClick={() => onSelect(hospital)}>
    <h3>{hospital.name}</h3>
    <p><strong>Adresa:</strong> {hospital.address}</p>
    <p><strong>Specialitetet:</strong> {hospital.specialties.join(', ')}</p>
  </div>
);

const HospitalCarousel = ({ hospitals, onSelect }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('.hospital-card').offsetWidth + 20; // Include gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300); // Update buttons after scroll
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const carousel = carouselRef.current;
    carousel.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);
    return () => {
      carousel.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [hospitals]);

  return (
    <div className="hospital-carousel">
      <button
        className="carousel-arrow left"
        onClick={() => scrollCarousel('left')}
        disabled={!canScrollLeft}
      >
        ←
      </button>
      <div className="hospital-list" ref={carouselRef}>
        {hospitals.map((hospital) => (
          <HospitalCard
            key={hospital.id}
            hospital={hospital}
            onSelect={onSelect}
          />
        ))}
      </div>
      <button
        className="carousel-arrow right"
        onClick={() => scrollCarousel('right')}
        disabled={!canScrollRight}
      >
        →
      </button>
    </div>
  );
};

const DoctorCard = ({ doctor, onSelect }) => (
  <div className="doctor-card" onClick={() => onSelect(doctor)}>
    <div className="doctor-avatar">{doctor.name[0]}</div>
    <div className="doctor-info">
      <p className="name">{doctor.name}</p>
      <p className="specialty">{doctor.specialty}</p>
      <p className="availability">E disponueshme: {doctor.availability}</p>
    </div>
  </div>
);

const Appointments = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [healthProblem, setHealthProblem] = useState('');
  const [suggestedSpecialty, setSuggestedSpecialty] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const symptomSpecialtyMap = {
    'dhimbje gjoksi': 'Kardiologji',
    'dhimbje koke': 'Neurologji',
    'dhimbje stomaku': 'Gastroenterologji',
    'probleme me frymëmarrje': 'Pulmonologji',
    'dhimbje kyçesh': 'Ortopedi',
  };

  const doctorSchedules = {
    'D001': {
      'E Hënë': ['09:00', '10:00', '11:00', '13:00', '14:00'],
      'E Martë': ['09:00', '10:00', '11:00', '13:00', '14:00'],
      'E Mërkurë': ['09:00', '10:00', '11:00', '13:00', '14:00'],
      'E Enjte': ['09:00', '10:00', '11:00', '13:00', '14:00'],
      'E Premte': ['09:00', '10:00', '11:00', '13:00', '14:00'],
    },
    'D002': {
      'E Martë': ['10:00', '11:00', '12:00', '14:00', '15:00'],
      'E Mërkurë': ['10:00', '11:00', '12:00', '14:00', '15:00'],
      'E Enjte': ['10:00', '11:00', '12:00', '14:00', '15:00'],
    },
    'D003': {
      'E Mërkurë': ['08:00', '09:00', '10:00', '11:00', '12:00'],
      'E Enjte': ['08:00', '09:00', '10:00', '11:00', '12:00'],
      'E Premte': ['08:00', '09:00', '10:00', '11:00', '12:00'],
      'E Shtunë': ['08:00', '09:00', '10:00'],
    },
    'D004': {
      'E Hënë': ['11:00', '12:00', '13:00', '14:00', '15:00'],
      'E Martë': ['11:00', '12:00', '13:00', '14:00', '15:00'],
      'E Mërkurë': ['11:00', '12:00', '13:00', '14:00', '15:00'],
    },
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      const response = [
        {
          id: 'H001',
          name: 'Spitali Qendror Tirana',
          address: 'Rruga e Dibrës, Tirana',
          specialties: ['Kardiologji', 'Neurologji', 'Gastroenterologji', 'Pulmonologji'],
        },
        {
          id: 'H002',
          name: 'Spitali Amerikan',
          address: 'Rruga Dritan Hoxha, Tirana',
          specialties: ['Kardiologji', 'Ortopedi', 'Neurologji'],
        },
        {
          id: 'H003',
          name: 'Spitali Hygeia',
          address: 'Autostrada Tiranë-Durrës, Tirana',
          specialties: ['Gastroenterologji', 'Pulmonologji', 'Ortopedi'],
        },
      ];
      setHospitals(response);
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      const fetchDoctors = async () => {
        const response = [
          {
            id: 'D001',
            name: 'Dr. Endrit',
            specialty: 'Kardiologji',
            hospitalId: 'H001',
            availability: 'E Hënë - E Premte, 09:00-15:00',
          },
          {
            id: 'D002',
            name: 'Dr. Albana',
            specialty: 'Neurologji',
            hospitalId: 'H001',
            availability: 'E Martë - E Enjte, 10:00-16:00',
          },
          {
            id: 'D003',
            name: 'Dr. Besim',
            specialty: 'Ortopedi',
            hospitalId: 'H002',
            availability: 'E Mërkurë - E Shtunë, 08:00-14:00',
          },
          {
            id: 'D004',
            name: 'Dr. Mirela',
            specialty: 'Gastroenterologji',
            hospitalId: 'H003',
            availability: 'E Hënë - E Mërkurë, 11:00-17:00',
          },
        ];
        const filteredDoctors = response.filter(
          (doctor) =>
            doctor.hospitalId === selectedHospital.id &&
            (!suggestedSpecialty || doctor.specialty === suggestedSpecialty)
        );
        setDoctors(filteredDoctors);
      };
      fetchDoctors();
    } else {
      setDoctors([]);
      setSelectedDoctor(null);
      setAppointmentDate('');
      setAvailableTimes([]);
      setSelectedTime('');
    }
  }, [selectedHospital, suggestedSpecialty]);

  const handleHealthProblemChange = (e) => {
    const problem = e.target.value.toLowerCase();
    setHealthProblem(problem);
    const specialty = Object.keys(symptomSpecialtyMap).find((key) =>
      problem.includes(key)
    );
    setSuggestedSpecialty(specialty ? symptomSpecialtyMap[specialty] : '');
  };

  const getDayName = (date) => {
    const days = [
      'E Dielë',
      'E Hënë',
      'E Martë',
      'E Mërkurë',
      'E Enjte',
      'E Premte',
      'E Shtunë',
    ];
    return days[date.getDay()];
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDate('');
    setAvailableTimes([]);
    setSelectedTime('');
  };

  const handleDateChange = (e) => {
    const dateStr = e.target.value;
    setAppointmentDate(dateStr);
    setSelectedTime('');
    if (selectedDoctor && dateStr) {
      const date = new Date(dateStr);
      const dayName = getDayName(date);
      const doctorSchedule = doctorSchedules[selectedDoctor.id] || {};
      const possibleTimes = doctorSchedule[dayName] || [];
      const bookedTimes = bookedAppointments
        .filter(
          (appt) =>
            appt.doctorId === selectedDoctor.id &&
            appt.date === dateStr
        )
        .map((appt) => appt.time);
      const freeTimes = possibleTimes.filter(
        (time) => !bookedTimes.includes(time)
      );
      setAvailableTimes(freeTimes);
    } else {
      setAvailableTimes([]);
    }
  };

  const handleBookAppointment = () => {
    if (selectedDoctor && appointmentDate && selectedTime) {
      const newAppointment = {
        doctorId: selectedDoctor.id,
        hospital: selectedHospital.name,
        doctor: selectedDoctor.name,
        date: appointmentDate,
        time: selectedTime,
      };
      setBookedAppointments([...bookedAppointments, newAppointment]);
      setShowConfirmation(true);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setHealthProblem('');
    setSuggestedSpecialty('');
    setAppointmentDate('');
    setAvailableTimes([]);
    setSelectedTime('');
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="appointments-container">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarOpen ? '✖' : '☰'}
        </button>
        <div className="header">
          <h1 className="header-title">Planifiko një Takim</h1>
          <p className="header-subtitle">Zgjidhni një spital dhe mjek për problemin tuaj shëndetësor</p>
        </div>
        <div className="appointment-section">
          <h2>Zgjidh Spitalin</h2>
          <HospitalCarousel
            hospitals={hospitals}
            onSelect={setSelectedHospital}
          />
          {selectedHospital && (
            <>
              <h2>Përshkruani Problemin Shëndetësor</h2>
              <input
                type="text"
                value={healthProblem}
                onChange={handleHealthProblemChange}
                placeholder="p.sh. dhimbje gjoksi, dhimbje koke..."
                className="health-problem-input"
              />
              {suggestedSpecialty && (
                <p className="suggested-specialty">
                  Specialiteti i sugjeruar: <strong>{suggestedSpecialty}</strong>
                </p>
              )}
              <h2>Zgjidh Mjekun</h2>
              <div className="doctor-list">
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onSelect={handleDoctorSelect}
                    />
                  ))
                ) : (
                  <p className="no-data">Nuk ka mjekë të disponueshëm për këtë specialitet.</p>
                )}
              </div>
            </>
          )}
          {selectedDoctor && (
            <>
              <h2>Zgjidh Datën dhe Orën</h2>
              <div className="calendar-section">
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={handleDateChange}
                  min={today}
                  className="date-input"
                  disabled={!selectedDoctor}
                />
                {appointmentDate && (
                  <div className="time-slots">
                    <h3>Oraret e Disponueshme</h3>
                    {availableTimes.length > 0 ? (
                      <div className="time-slot-list">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            className={`time-slot-button ${selectedTime === time ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">Nuk ka orare të disponueshme për këtë datë.</p>
                    )}
                  </div>
                )}
              </div>
              <button
                className="accent-button book-appointment-button"
                onClick={handleBookAppointment}
                disabled={!selectedTime}
              >
                Rezervo Takimin
              </button>
            </>
          )}
        </div>
        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="modal-content">
              <h3>Takimi u Rezervua!</h3>
              <p>
                Ju keni rezervuar një takim me <strong>{selectedDoctor.name}</strong> (<strong>{selectedDoctor.specialty}</strong>) në{' '}
                <strong>{selectedHospital.name}</strong> më{' '}
                <strong>{appointmentDate}</strong> në orën{' '}
                <strong>{selectedTime}</strong>.
              </p>
              <button
                className="accent-button close-modal-button"
                onClick={closeConfirmation}
              >
                Mbyll
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;