import React, { useEffect, useState } from "react";


//Test file qe e krijum gjate zhvillim tprojektit me pa lidhjen e back-front permes API
function HelloFromBackend() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/test")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div style={{minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(-45deg,var(--accent-color), #034fa3c0)', color: 'white'}}>
      <h2>Mesazhi nga Backend: </h2>
      <p>{message}</p>
    </div>
  );
}

export default HelloFromBackend;
