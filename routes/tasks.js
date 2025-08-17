const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");
const cache = require("../middleware/cache");
const router = express.Router();

// Create task
router.post("/", auth, async (req, res) => {
  const { title, completed } = req.body;
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: "Title must be at least 3 characters" });
  }
  try {
    const task = await Task.create({ title: title.trim(), completed: !!completed, user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all tasks (cached)
router.get("/", auth, cache(60), async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get task by ID (cached)
router.get("/:id", auth, cache(60), async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  const { title, completed } = req.body;
  if (title !== undefined && title.trim().length < 3) {
    return res.status(400).json({ message: "Title must be at least 3 characters" });
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (title !== undefined) task.title = title.trim();
    if (completed !== undefined) task.completed = !!completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
