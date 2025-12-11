import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [myJobs, setMyJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // ---------------- LOAD JOBS ----------------
  const loadJobs = async () => {
    const res = await fetch("http://localhost:5000/api/jobs");
    const jobs = await res.json();
    setMyJobs(jobs.filter((j) => j.clientId === user.id));
  };

  // ---------------- LOAD PROPOSALS ----------------
  const loadProposals = async (jobId) => {
    const res = await fetch("http://localhost:5000/api/proposals");
    const data = await res.json();
    setProposals(data.filter((p) => p.jobId === jobId));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // ---------------- CREATE JOB ----------------
  const createJob = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        clientId: user.id,
        status: "open",
      }),
    });

    if (!res.ok) return alert("Error creating job");

    alert("Job created!");
    setDescription("");
    setTitle("");
    loadJobs();
  };

  // ---------------- ACCEPT / REJECT PROPOSAL ----------------
  const updateProposal = async (proposalId, status) => {
    const res = await fetch(`http://localhost:5000/api/proposals/${proposalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    await res.json();
    alert(`Proposal ${status}`);
    loadProposals(selectedJob.id);
    loadJobs();
  };

  // ---------------- DELETE PROPOSAL ----------------
  const deleteProposal = async (proposalId) => {
    await fetch(`http://localhost:5000/api/proposals/${proposalId}`, {
      method: "DELETE",
    });

    alert("Proposal deleted");
    loadProposals(selectedJob.id);
  };

  // ---------------- DELETE JOB ----------------
  const deleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
      method: "DELETE",
    });

    alert("Job deleted!");
    setSelectedJob(null);
    loadJobs();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Client Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      {/* CREATE JOB */}
      <h2>Create Job</h2>
      <form
        onSubmit={createJob}
        style={{ display: "flex", flexDirection: "column", width: 400, gap: 10 }}
      >
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Job Description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Post Job</button>
      </form>

      {/* JOB LIST */}
      <h2 style={{ marginTop: 30 }}>Your Jobs</h2>

      {myJobs.length === 0 ? (
        <p>No jobs posted.</p>
      ) : (
        myJobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 15,
            }}
          >
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>Status: {job.status}</p>

            <button
              onClick={() => {
                setSelectedJob(job);
                loadProposals(job.id);
              }}
            >
              View Proposals
            </button>

            <button
              style={{ marginLeft: 10, color: "red" }}
              onClick={() => deleteJob(job.id)}
            >
              Delete Job
            </button>
          </div>
        ))
      )}

      {/* PROPOSALS SECTION */}
      {selectedJob && (
        <div style={{ marginTop: 40 }}>
          <h2>Proposals for: {selectedJob.title}</h2>

          {proposals.length === 0 ? (
            <p>No proposals yet.</p>
          ) : (
            proposals.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #aaa",
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <p><b>Freelancer:</b> {p.freelancerId}</p>
                <p><b>Cover Letter:</b> {p.coverLetter}</p>
                <p><b>Status:</b> {p.status}</p>

                {p.status === "pending" && (
                  <>
                    <button onClick={() => updateProposal(p.id, "accepted")}>
                      Accept
                    </button>
                    <button onClick={() => updateProposal(p.id, "rejected")}>
                      Reject
                    </button>
                  </>
                )}

                {p.status === "accepted" && (
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => navigate(`/chat/${p.id}`)}
                  >
                    Open Chat
                  </button>
                )}

                <button
                  style={{ marginLeft: 10, color: "red" }}
                  onClick={() => deleteProposal(p.id)}
                >
                  Delete Proposal
                </button>
              </div>
            ))
          )}

          <button style={{ marginTop: 10 }} onClick={() => setSelectedJob(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default ClientDashboard;
