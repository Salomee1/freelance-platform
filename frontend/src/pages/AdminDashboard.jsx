import { useState, useEffect } from "react";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);

  // ---------------- LOAD ALL DATA ----------------
  const loadUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const loadJobs = async () => {
    const res = await fetch("http://localhost:5000/api/jobs");
    const data = await res.json();
    setJobs(data);
  };

  const loadProposals = async () => {
    const res = await fetch("http://localhost:5000/api/proposals");
    const data = await res.json();
    setProposals(data);
  };

  useEffect(() => {
    loadUsers();
    loadJobs();
    loadProposals();
  }, []);

  // ---------------- DELETE FUNCTIONS ----------------
  const deleteUser = async (id) => {
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("User deleted");
      loadUsers();
    }
  };

  const deleteJob = async (id) => {
    const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Job deleted");
      loadJobs();
    }
  };

  const deleteProposal = async (id) => {
    const res = await fetch(`http://localhost:5000/api/proposals/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Proposal deleted");
      loadProposals();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      <h2 style={{ marginTop: 30 }}>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((u) => (
          <div key={u.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <p>
              <strong>Name:</strong> {u.name}
            </p>
            <p>
              <strong>Email:</strong> {u.email}
            </p>
            <p>
              <strong>Role:</strong> {u.role}
            </p>

            <button
              style={{ background: "red", color: "white" }}
              onClick={() => deleteUser(u.id)}
            >
              Delete User
            </button>
          </div>
        ))
      )}

      <h2 style={{ marginTop: 30 }}>All Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <p>
              <strong>Title:</strong> {job.title}
            </p>
            <p>
              <strong>Description:</strong> {job.description}
            </p>
            <p>
              <strong>Status:</strong> {job.status}
            </p>
            <p>
              <strong>Client ID:</strong> {job.clientId}</p>

            <button
              style={{ background: "red", color: "white" }}
              onClick={() => deleteJob(job.id)}
            >
              Delete Job
            </button>
          </div>
        ))
      )}

      <h2 style={{ marginTop: 30 }}>All Proposals</h2>
      {proposals.length === 0 ? (
        <p>No proposals found.</p>
      ) : (
        proposals.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <p>
              <strong>Proposal ID:</strong> {p.id}
            </p>
            <p>
              <strong>Job ID:</strong> {p.jobId}
            </p>
            <p>
              <strong>Freelancer ID:</strong> {p.freelancerId}
            </p>
            <p>
              <strong>Status:</strong> {p.status}</p>

            <button
              style={{ background: "red", color: "white" }}
              onClick={() => deleteProposal(p.id)}
            >
              Delete Proposal
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
