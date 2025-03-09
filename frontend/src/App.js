import { Routes, Route } from "react-router-dom"; 
import Signup from "./Signup";
import Login from "./Login";
import LandingPage from "./LandingPage"; 

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
