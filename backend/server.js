const express = require("express");
const cors = require("cors");

// ROUTES
const usersRoutes = require("./routes/users");
const jobsRoutes = require("./routes/jobs");
const proposalsRoutes = require("./routes/proposals");


const app = express();
app.use(cors());
app.use(express.json());

// USE ROUTES
app.use("/api/users", usersRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/proposals", proposalsRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
