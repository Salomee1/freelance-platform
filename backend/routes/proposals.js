const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Paths to database files
const proposalsFilePath = path.join(__dirname, "..", "data", "proposals.json");
const jobsFilePath = path.join(__dirname, "..", "data", "jobs.json");

// Helper functions
function loadProposals() {
  return JSON.parse(fs.readFileSync(proposalsFilePath, "utf8"));
}

function saveProposals(data) {
  fs.writeFileSync(proposalsFilePath, JSON.stringify(data, null, 2));
}

function loadJobs() {
  return JSON.parse(fs.readFileSync(jobsFilePath, "utf8"));
}

function saveJobs(data) {
  fs.writeFileSync(jobsFilePath, JSON.stringify(data, null, 2));
}

// -------------------------------------------------------------
// GET ALL PROPOSALS
// -------------------------------------------------------------
router.get("/", (req, res) => {
  const proposals = loadProposals();
  res.json(proposals);
});

// -------------------------------------------------------------
// CREATE A NEW PROPOSAL
// -------------------------------------------------------------
router.post("/", (req, res) => {
  const proposals = loadProposals();

  const newProposal = {
    id: Date.now(),
    jobId: req.body.jobId,
    freelancerId: req.body.freelancerId,
    coverLetter: req.body.coverLetter,
    status: "pending",
    rating: null,       // for completion
    feedback: "",       // for completion
  };

  proposals.push(newProposal);
  saveProposals(proposals);

  res.status(201).json(newProposal);
});

// -------------------------------------------------------------
// GET PROPOSAL BY ID
// -------------------------------------------------------------
router.get("/:id", (req, res) => {
  const proposals = loadProposals();
  const proposal = proposals.find((p) => p.id === Number(req.params.id));

  if (!proposal) {
    return res.status(404).json({ message: "Proposal not found" });
  }

  res.json(proposal);
});

// -------------------------------------------------------------
// UPDATE PROPOSAL (ACCEPT / REJECT / COMPLETE + FEEDBACK)
// -------------------------------------------------------------
router.put("/:id", (req, res) => {
  const proposalId = Number(req.params.id);
  const { status, rating, feedback } = req.body;

  let proposals = loadProposals();
  let jobs = loadJobs();

  const proposal = proposals.find((p) => p.id === proposalId);

  if (!proposal) {
    return res.status(404).json({ message: "Proposal not found" });
  }

  // ------------------------------------------
  // 1. Handle ACCEPT / REJECT
  // ------------------------------------------
  if (status === "accepted" || status === "rejected") {
    proposal.status = status;

    if (status === "accepted") {
      const job = jobs.find((j) => j.id === proposal.jobId);

      if (job) {
        job.status = "in_progress";
        job.assignedFreelancerId = proposal.freelancerId;
        saveJobs(jobs);

        // Reject all other proposals for same job
        proposals = proposals.map((p) =>
          p.jobId === job.id && p.id !== proposal.id
            ? { ...p, status: "rejected" }
            : p
        );
      }
    }
  }

  // ------------------------------------------
  // 2. Handle COMPLETION + FEEDBACK
  // ------------------------------------------
  if (status === "completed") {
    proposal.status = "completed";
    proposal.rating = rating;
    proposal.feedback = feedback;

    // Update job status too
    const job = jobs.find((j) => j.id === proposal.jobId);
    if (job) {
      job.status = "completed";
      saveJobs(jobs);
    }
  }

  // SAVE PROPOSALS
  saveProposals(proposals);

  res.json({
    message: "Proposal updated",
    proposal,
  });
});

// -------------------------------------------------------------
module.exports = router;
