const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Path to proposals.json file
const proposalsFilePath = path.join(__dirname, "..", "data", "proposals.json");

// ------------------ GET ALL PROPOSALS ------------------ //
router.get("/", (req, res) => {
  const proposals = JSON.parse(fs.readFileSync(proposalsFilePath, "utf8"));
  res.json(proposals);
});

// ------------------ CREATE PROPOSAL ------------------ //
router.post("/", (req, res) => {
  const proposals = JSON.parse(fs.readFileSync(proposalsFilePath, "utf8"));

  const newProposal = {
    id: Date.now(),
    jobId: req.body.jobId,
    freelancerId: req.body.freelancerId,
    coverLetter: req.body.coverLetter,
    status: "pending" // default
  };

  proposals.push(newProposal);

  fs.writeFileSync(proposalsFilePath, JSON.stringify(proposals, null, 2));

  res.status(201).json(newProposal);
});

// ------------------ GET PROPOSAL BY ID ------------------ //
router.get("/:id", (req, res) => {
  const proposalId = Number(req.params.id);
  const proposals = JSON.parse(fs.readFileSync(proposalsFilePath, "utf8"));

  const proposal = proposals.find(p => p.id === proposalId);

  if (!proposal) {
    return res.status(404).json({ message: "Proposal not found" });
  }

  res.json(proposal);
});

// ------------------ UPDATE PROPOSAL ------------------ //
router.put("/:id", (req, res) => {
  const proposalId = Number(req.params.id);
  const proposals = JSON.parse(fs.readFileSync(proposalsFilePath, "utf8"));

  const proposal = proposals.find(p => p.id === proposalId);

  if (!proposal) {
    return res.status(404).json({ message: "Proposal not found" });
  }

  if (req.body.coverLetter) proposal.coverLetter = req.body.coverLetter;
  if (req.body.status) proposal.status = req.body.status;

  fs.writeFileSync(proposalsFilePath, JSON.stringify(proposals, null, 2));

  res.json(proposal);
});
  module.exports = router;

// ------------------ DELET
