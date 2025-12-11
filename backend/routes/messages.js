const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const messagesFilePath = path.join(__dirname, "..", "data", "messages.json");

// Load + Save
const loadMessages = () =>
  JSON.parse(fs.readFileSync(messagesFilePath, "utf8"));
const saveMessages = (data) =>
  fs.writeFileSync(messagesFilePath, JSON.stringify(data, null, 2));

// ------------------ GET MESSAGES FOR PROPOSAL ------------------
router.get("/:proposalId", (req, res) => {
  const messages = loadMessages();
  const filtered = messages.filter(
    (msg) => msg.proposalId === Number(req.params.proposalId)
  );
  res.json(filtered);
});

// ------------------ SEND MESSAGE ------------------
router.post("/", (req, res) => {
  const messages = loadMessages();

  const newMsg = {
    id: Date.now(),
    proposalId: req.body.proposalId,
    senderId: req.body.senderId,
    senderName: req.body.senderName,
    text: req.body.text,
    timestamp: new Date(),
  };

  messages.push(newMsg);
  saveMessages(messages);

  res.status(201).json(newMsg);
});

module.exports = router;
