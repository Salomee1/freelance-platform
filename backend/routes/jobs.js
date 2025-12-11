const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Path to jobs.json file
const jobsFilePath = path.join(__dirname, "..", "data", "jobs.json");

// ------------------ GET ALL JOBS ------------------ //
router.get("/", (req, res) => {
  const jobs = JSON.parse(fs.readFileSync(jobsFilePath, "utf8"));
  res.json(jobs);
});

// ------------------ CREATE A NEW JOB ------------------ //
router.post("/", (req, res) => {
  const jobs = JSON.parse(fs.readFileSync(jobsFilePath, "utf8"));

  const newJob = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    clientId: req.body.clientId,
    status: "open"
  };

  jobs.push(newJob);

  fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2));

  res.status(201).json(newJob);
});
// ------------------ UPDATE JOB STATUS ------------------ //
router.put("/:id", (req, res) => {
  const jobId = Number(req.params.id);
  const jobs = JSON.parse(fs.readFileSync(jobsFilePath, "utf8"));

  const job = jobs.find(j => j.id === jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  // Update only status or other fields if needed
  if (req.body.status) {
    job.status = req.body.status;
  }

  fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2));
  res.json(job);
});
// ------------------ DELETE A JOB ------------------ //
router.delete("/:id", (req, res) => {
  const jobId = Number(req.params.id);
  let jobs = JSON.parse(fs.readFileSync(jobsFilePath, "utf8"));

  const jobIndex = jobs.findIndex(j => j.id === jobId);

  if (jobIndex === -1) {
    return res.status(404).json({ message: "Job not found" });
  }

  const deletedJob = jobs[jobIndex];

  // Remove job from array
  jobs.splice(jobIndex, 1);

  // Save updated array
  fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2));

  res.json({ message: "Job deleted", deletedJob });
});
router.delete("/:id", (req, res) => {
  const jobId = Number(req.params.id);

  const jobs = JSON.parse(fs.readFileSync(jobsFilePath, "utf8"));
  const updatedJobs = jobs.filter((j) => j.id !== jobId);

  fs.writeFileSync(jobsFilePath, JSON.stringify(updatedJobs, null, 2));

  res.json({ message: "Job deleted successfully" });
});

module.exports = router;