const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const USERS_FILE = path.join(__dirname, "../data/users.json");

// ----------- HELPERS ----------- //
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
  }
  const data = fs.readFileSync(USERS_FILE, "utf8").trim();
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ----------- REGISTER USER ----------- //
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Name, email, password and role are required" });
  }

  const users = loadUsers();

  // Check for duplicate email
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ message: "User with this email already exists" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role,
  };

  users.push(newUser);
  saveUsers(users);

  res.json({ message: "User registered", user: newUser });
});

// ----------- LOGIN USER ----------- //
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      message: "Email, password and role are required",
    });
  }

  const users = loadUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  if (user.role !== role) {
    return res.status(403).json({
      message: `This email belongs to a ${user.role}. You cannot log in as ${role}.`,
    });
  }

  res.json({
    message: "Login successful",
    user,
  });
});

// ----------- ADMIN: GET ALL USERS ----------- //
router.get("/", (req, res) => {
  const users = loadUsers();
  res.json(users);
});

// ----------- ADMIN: DELETE USER ----------- //
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  let users = loadUsers();

  const exists = users.some((u) => u.id === id);
  if (!exists) {
    return res.status(404).json({ message: "User not found" });
  }

  users = users.filter((u) => u.id !== id);
  saveUsers(users);

  res.json({ message: "User deleted" });
});

module.exports = router;


