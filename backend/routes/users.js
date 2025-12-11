const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Path to users.json file
const usersFilePath = path.join(__dirname, "..", "data", "users.json");

// ------------------ GET ALL USERS ------------------ //
router.get("/", (req, res) => {
  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
  res.json(users);
});

// ------------------ CREATE A NEW USER ------------------ //
router.post("/", (req, res) => {
  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    role: req.body.role  // "client", "freelancer", or "admin"
  };

  users.push(newUser);

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(201).json(newUser);
});

// ------------------ GET USER BY ID ------------------ //
router.get("/:id", (req, res) => {
  const userId = Number(req.params.id);
  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// ------------------ UPDATE USER ------------------ //
router.put("/:id", (req, res) => {
  const userId = Number(req.params.id);
  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update fields if provided
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.role) user.role = req.body.role;

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.json(user);
});

// ------------------ DELETE USER ------------------ //
router.delete("/:id", (req, res) => {
  const userId = Number(req.params.id);
  let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = users[index];
  users.splice(index, 1);

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.json({ message: "User deleted", deletedUser });
});

module.exports = router;
