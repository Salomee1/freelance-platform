import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // default value
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // Save logged-in user
    localStorage.setItem("user", JSON.stringify(data.user));

    alert(`Logged in as ${data.user.role}`);

    // Redirect user based on role
    if (data.user.role === "client") navigate("/client-dashboard");
    if (data.user.role === "freelancer") navigate("/freelancer-dashboard");
    if (data.user.role === "admin") navigate("/admin-dashboard");
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
