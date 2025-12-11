import "./styles/global.css";
import { Routes, Route, Link } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChatRoom from "./pages/ChatRoom";

function App() {
  return (
    <div className="app-container">

      {/* 🔹 NAVIGATION BAR */}
      <nav className="navbar">
        <Link className="nav-link" to="/">Login</Link>
        <Link className="nav-link" to="/register">Register</Link>
      </nav>

      {/* 🔹 ROUTES */}
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Chat */}
        <Route path="/chat/:proposalId" element={<ChatRoom />} />
      </Routes>

    </div>
  );
}

export default App;
