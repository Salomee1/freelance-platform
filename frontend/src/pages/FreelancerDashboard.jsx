import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FreelancerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  // ---------------- LOAD OPEN JOBS ----------------
  const loadJobs = async () => {
    const res = await fetch("http://localhost:5000/api/jobs");
    const data = await res.json();
    setJobs(data.filter((j) => j.status === "open"));
  };

  // ---------------- LOAD MY PROPOSALS ----------------
  const loadMyProposals = async () => {
    const res = await fetch("http://localhost:5000/api/proposals");
    const proposals = await res.json();
    setMyProposals(proposals.filter((p) => p.freelancerId === user.id));
  };

  useEffect(() => {
    loadJobs();
    loadMyProposals();
  }, []);

  // ---------------- SUBMIT PROPOSAL ----------------
  const submitProposal = async () => {
    const res = await fetch("http://localhost:5000/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: selectedJob.id,
        freelancerId: user.id,
        coverLetter,
      }),
    });

    if (!res.ok) return alert("Error submitting proposal");

    alert("Proposal submitted!");
    setCoverLetter("");
    setSelectedJob(null);
    loadMyProposals();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Freelancer Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      {/* ---------------- LIST OF OPEN JOBS ---------------- */}
      <h2>Available Jobs</h2>

      {jobs.length === 0 ? (
        <p>No open jobs right now.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
            }}
          >
            <h3>{job.title}</h3>
            <p>{job.description}</p>

            <button onClick={() => setSelectedJob(job)}>Apply</button>
          </div>
        ))
      )}

      {/* ---------------- APPLY TO SELECTED JOB ---------------- */}
      {selectedJob && (
        <div style={{ marginTop: 20, padding: 15, border: "1px solid #aaa" }}>
          <h2>Applying to: {selectedJob.title}</h2>

          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter"
            style={{ width: "100%", height: 80 }}
          />

          <button onClick={submitProposal}>Submit Proposal</button>
          <button
            style={{ marginLeft: 10 }}
            onClick={() => setSelectedJob(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ---------------- MY PROPOSALS ---------------- */}
      <h2 style={{ marginTop: 30 }}>My Proposals</h2>

      {myProposals.length === 0 ? (
        <p>You have not applied to any jobs yet.</p>
      ) : (
        myProposals.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
              background:
                p.status === "accepted"
                  ? "#e8ffe8"
                  : p.status === "rejected"
                  ? "#ffe8e8"
                  : "#ffffff",
            }}
          >
            <p>
              <strong>Job ID:</strong> {p.jobId}
            </p>
            <p>
              <strong>Your Cover Letter:</strong> {p.coverLetter}
            </p>
            <p>
              <strong>Status:</strong> {p.status}
            </p>

            {p.status === "accepted" && (
              <button onClick={() => navigate(`/chat/${p.id}`)}>
                Open Chat
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default FreelancerDashboard;
