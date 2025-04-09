import React, { useEffect, useState } from "react";

function HelloFromBackend() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  return (
    <div>
      <h2>Mesazhi nga Backend: </h2>
      <p>{message}</p>
    </div>
  );
}

export default HelloFromBackend;