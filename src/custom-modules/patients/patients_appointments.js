import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/patients_css/patients_appointments.css';
import '../../css/sidebar.css';

// API base URL (replace with your actual backend URL)
const API_BASE_URL = 'http://api.yourclinic.com/v1';

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
  const [error, setError] = useState('');
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
      try {
        const response = await fetch(`${API_BASE_URL}/hospitals`);
        if (!response.ok) throw new Error('Failed to fetch hospitals');
        const data = await response.json();
        setHospitals(data);
        setError('');
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        setError('Dështoi në ngarkimin e spitaleve. Ju lutem provoni përsëri.');
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      const fetchDoctors = async () => {
        try {
          const response = await fetch(
              `${API_BASE_URL}/doctors?hospitalId=${selectedHospital.id}${
                  suggestedSpecialty ? `&specialty=${suggestedSpecialty}` : ''
              }`
          );
          if (!response.ok) throw new Error('Failed to fetch doctors');
          const data = await response.json();
          setDoctors(data);
          setError('');
        } catch (error) {
          console.error('Error fetching doctors:', error);
          setError('Dështoi në ngarkimin e mjekëve. Ju lutem provoni përsëri.');
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
      try {
        const date = new Date(dateStr);
        const dayName = getDayName(date);
        const response = await fetch(
            `${API_BASE_URL}/doctors/${selectedDoctor.id}/schedule?date=${dateStr}`
        );
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const schedule = await response.json();
        const possibleTimes = schedule[dayName] || [];
        const bookedResponse = await fetch(
            `${API_BASE_URL}/appointments?doctorId=${selectedDoctor.id}&date=${dateStr}`
        );
        if (!bookedResponse.ok) throw new Error('Failed to fetch booked appointments');
        const bookedAppointments = await bookedResponse.json();
        const bookedTimes = bookedAppointments.map((appt) => appt.time);
        const freeTimes = possibleTimes.filter(
            (time) => !bookedTimes.includes(time)
        );
        setAvailableTimes(freeTimes);
        setError('');
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError('Dështoi në ngarkimin e orareve. Ju lutem provoni përsëri.');
      }
    } else {
      setAvailableTimes([]);
    }
  };

  const handleBookAppointment = async () => {
    if (selectedDoctor && appointmentDate && selectedTime) {
      try {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctorId: selectedDoctor.id,
            hospitalId: selectedHospital.id,
            date: appointmentDate,
            time: selectedTime,
            healthProblem,
          }),
        });
        if (!response.ok) throw new Error('Failed to book appointment');
        const newAppointment = await response.json();
        setBookedAppointments([...bookedAppointments, newAppointment]);
        setShowConfirmation(true);
        setError('');
      } catch (error) {
        console.error('Error booking appointment:', error);
        setError('Dështoi në rezervimin e takimit. Ju lutem provoni përsëri.');
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
          {error && <div className="error-message">{error}</div>}
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