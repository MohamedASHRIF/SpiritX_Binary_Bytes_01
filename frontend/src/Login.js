import {useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateFields = () => {
    let isValid = true;
    if (!username) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      const { data } = response;

      if (data.success) {
        localStorage.setItem("username", username);
        localStorage.setItem("isAuthenticated", "true");
        alert("Login successful!");
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated")) {
      navigate("/");
    }
  }, [navigate]);
  


 
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
  
    if (!value) {
      setUsernameError("Username is required");
    } else if (value.length < 8) {
      setUsernameError("Username must be at least 8 characters long");
    } else {
      setUsernameError("");
    }
  };

  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!e.target.value) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
  };



  
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          {usernameError && <div className="error">{usernameError}</div>}
        </div>

        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <div className="error">{passwordError}</div>}
        </div>

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Register</Link>
      </p>
    </div>
  );
}

export default Login;
