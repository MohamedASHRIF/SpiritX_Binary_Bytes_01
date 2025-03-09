import { useState } from "react";
import axios from "axios";
import { useNavigate ,Link } from "react-router-dom";
import "./Signup.css";  

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [passwordStrength, setPasswordStrength] = useState(""); 
  const [usernameError, setUsernameError] = useState(""); 
  const [passwordError, setPasswordError] = useState(""); 
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); 
  const navigate = useNavigate();

  let debounceTimer;
  
  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    
    if (newUsername.length < 8) {
      setUsernameError("Username must be at least 8 characters.");
    } else {
      setUsernameError("");
    }
  
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (newUsername.length >= 8) {
        console.log('Sending username to the backend:', { username: newUsername }); 

        try {
          const response = await axios.post(
            "http://localhost:5000/api/auth/check-username", 
            { username: newUsername }  
           );
          console.log('Response:', response.data); 
          if (!response.data.isUnique) {
            setUsernameError("Username is already taken.");
          } else {
            setUsernameError("");
          }
        } catch (error) {
          console.log(error); 
          if (error.response) {
            console.error("Error response: ", error.response.data);
          }
          setUsernameError("Error checking username.");
        }
      }
    }, 500);
  };


  
  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setPassword(pass);

    const strength = calculatePasswordStrength(pass);
    setPasswordStrength(strength);

    const passwordValidation = validatePassword(pass);
    if (!passwordValidation) {
      setPasswordError("Password must contain at least one lowercase letter, one uppercase letter, and one special character.");
    } else {
      setPasswordError("");
    }

    if (confirmPassword && confirmPassword !== pass) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const validatePassword = (password) => {
    const regexLowercase = /[a-z]/;
    const regexUppercase = /[A-Z]/;
    const regexSpecialChar = /[\d\W]/;
    return regexLowercase.test(password) && regexUppercase.test(password) && regexSpecialChar.test(password);
  };
  
  const calculatePasswordStrength = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);
  
    if (password.length < 6) return "Too short";
    if (hasLowercase && hasUppercase && hasNumber && hasSpecialChar) return "strong";
    if ((hasLowercase && hasUppercase) || (hasLowercase && hasNumber)) return "medium";
    return "weak";
  };
  
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    if (usernameError || passwordError || confirmPasswordError) {
      setErrorMessage("Please fix the errors before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        password,
        confirmPassword,
      });
      alert("Signup successful! Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response.data.message); 
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {errorMessage && <div className="error">{errorMessage}</div>} 
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={handleUsernameChange} 
        />
        {usernameError && <div className="error">{usernameError}</div>} 

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={handlePasswordChange} 
        />
        {passwordError && <div className="error">{passwordError}</div>}

        <div className={`password-strength ${passwordStrength}`}>
          {passwordStrength && `Password Strength: ${passwordStrength}`}
        </div>

        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (e.target.value !== password) {
              setConfirmPasswordError("Passwords do not match.");
            } else {
              setConfirmPasswordError("");
            }
          }} 
        />
        {confirmPasswordError && <div className="error">{confirmPasswordError}</div>} 

        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
