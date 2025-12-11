const express = require("express");
const cors = require("cors");

// ROUTES
const usersRoutes = require("./routes/users");
const jobsRoutes = require("./routes/jobs");
const proposalsRoutes = require("./routes/proposals");
const messagesRoutes = require("./routes/messages"); // NEW CHAT ROUTE

const app = express();

// MIDDLEWARE (must come BEFORE routes)
app.use(cors());
app.use(express.json());

// ROUTES (must come AFTER app is created)
app.use("/api/users", usersRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/proposals", proposalsRoutes);
app.use("/api/messages", messagesRoutes); // FIXED POSITION

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
