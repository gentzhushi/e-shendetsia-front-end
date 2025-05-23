import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/patients_css/patients_appointments.css';
import '../../css/sidebar.css';

//Prej loadConfig.js e merr pathin nga config.yml , edhe me ni enviroment variable e store pathin nUpperCase:
const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_ENDPOINT_PATIENTS_APPOINTMENTS}`;

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

const HospitalCarousel = ({ hospitals, onSelect, isLoading, error }) => {
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
      const cardWidth = carouselRef.current.querySelector('.hospital-card')?.offsetWidth + 20 || 200; // Include gap, fallback width
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
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
            disabled={!canScrollLeft || isLoading}
        >
          ←
        </button>
        <div className="hospital-list" ref={carouselRef}>
          {isLoading ? (
              <p>Duke ngarkuar...</p>
          ) : error ? (
              <p className="error-message">Gabim: {error}</p>
          ) : hospitals.length === 0 ? (
              <p className="no-data">Nuk ka spitale të disponueshme.</p>
          ) : (
              hospitals.map((hospital) => (
                  <HospitalCard
                      key={hospital.id}
                      hospital={hospital}
                      onSelect={onSelect}
                  />
              ))
          )}
        </div>
        <button
            className="carousel-arrow right"
            onClick={() => scrollCarousel('right')}
            disabled={!canScrollRight || isLoading}
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
  const [isLoading, setIsLoading] = useState({
    hospitals: false,
    doctors: false,
    times: false,
    booking: false,
  });
  const [error, setError] = useState({
    hospitals: null,
    doctors: null,
    times: null,
    booking: null,
  });
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

  useEffect(() => {
    const fetchHospitals = async () => {
      setIsLoading((prev) => ({ ...prev, hospitals: true }));
      setError((prev) => ({ ...prev, hospitals: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/hospitals`, {
          headers: {
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Failed to fetch hospitals');
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setError((prev) => ({ ...prev, hospitals: 'Gabim gjatë ngarkimit të spitaleve' }));
      } finally {
        setIsLoading((prev) => ({ ...prev, hospitals: false }));
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      const fetchDoctors = async () => {
        setIsLoading((prev) => ({ ...prev, doctors: true }));
        setError((prev) => ({ ...prev, doctors: null }));
        try {
          const response = await fetch(`${API_BASE_URL}/doctors?hospitalId=${selectedHospital.id}${suggestedSpecialty ? `&specialty=${encodeURIComponent(suggestedSpecialty)}` : ''}`, {
            headers: {
              // Add authentication headers if needed
              // 'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) throw new Error('Failed to fetch doctors');
          const data = await response.json();
          setDoctors(data);
        } catch (error) {
          console.error('Error fetching doctors:', error);
          setError((prev) => ({ ...prev, doctors: 'Gabim gjatë ngarkimit të mjekëve' }));
        } finally {
          setIsLoading((prev) => ({ ...prev, doctors: false }));
        }
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

  const handleDateChange = async (e) => {
    const dateStr = e.target.value;
    setAppointmentDate(dateStr);
    setSelectedTime('');
    if (selectedDoctor && dateStr) {
      setIsLoading((prev) => ({ ...prev, times: true }));
      setError((prev) => ({ ...prev, times: null }));
      try {
        const date = new Date(dateStr);
        const dayName = getDayName(date);
        const response = await fetch(`${API_BASE_URL}/doctors/${selectedDoctor.id}/schedule?date=${dateStr}`, {
          headers: {
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Failed to fetch available times');
        const data = await response.json();
        const possibleTimes = data[dayName] || [];
        const bookedResponse = await fetch(`${API_BASE_URL}/appointments?doctorId=${selectedDoctor.id}&date=${dateStr}`, {
          headers: {
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
        });
        if (!bookedResponse.ok) throw new Error('Failed to fetch booked appointments');
        const bookedAppointments = await bookedResponse.json();
        const bookedTimes = bookedAppointments.map((appt) => appt.time);
        const freeTimes = possibleTimes.filter((time) => !bookedTimes.includes(time));
        setAvailableTimes(freeTimes);
      } catch (error) {
        console.error('Error fetching available times:', error);
        setError((prev) => ({ ...prev, times: 'Gabim gjatë ngarkimit të orareve të disponueshme' }));
        setAvailableTimes([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, times: false }));
      }
    } else {
      setAvailableTimes([]);
    }
  };

  const handleBookAppointment = async () => {
    if (selectedDoctor && appointmentDate && selectedTime) {
      setIsLoading((prev) => ({ ...prev, booking: true }));
      setError((prev) => ({ ...prev, booking: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers if needed
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            doctorId: selectedDoctor.id,
            hospitalId: selectedHospital.id,
            date: appointmentDate,
            time: selectedTime,
            healthProblem: healthProblem || 'Nuk është specifikuar',
          }),
        });
        if (!response.ok) throw new Error('Failed to book appointment');
        const newAppointment = await response.json();
        setBookedAppointments([...bookedAppointments, {
          ...newAppointment,
          hospital: selectedHospital.name,
          doctor: selectedDoctor.name,
        }]);
        setShowConfirmation(true);
      } catch (error) {
        console.error('Error booking appointment:', error);
        setError((prev) => ({ ...prev, booking: 'Gabim gjatë rezervimit të takimit' }));
      } finally {
        setIsLoading((prev) => ({ ...prev, booking: false }));
      }
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
                isLoading={isLoading.hospitals}
                error={error.hospitals}
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
                    {isLoading.doctors ? (
                        <p>Duke ngarkuar...</p>
                    ) : error.doctors ? (
                        <p className="error-message">Gabim: {error.doctors}</p>
                    ) : doctors.length > 0 ? (
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
                        disabled={!selectedDoctor || isLoading.times}
                    />
                    {appointmentDate && (
                        <div className="time-slots">
                          <h3>Oraret e Disponueshme</h3>
                          {isLoading.times ? (
                              <p>Duke ngarkuar...</p>
                          ) : error.times ? (
                              <p className="error-message">Gabim: {error.times}</p>
                          ) : availableTimes.length > 0 ? (
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
                      disabled={!selectedTime || isLoading.booking}
                  >
                    {isLoading.booking ? 'Duke rezervuar...' : 'Rezervo Takimin'}
                  </button>
                  {error.booking && <p className="error-message">{error.booking}</p>}
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