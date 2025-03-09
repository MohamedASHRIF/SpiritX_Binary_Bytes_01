import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <h2>Hello, {username}!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default LandingPage;
