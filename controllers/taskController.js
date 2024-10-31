const Task = require('../models/Task');
const mongoose = require('mongoose');

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ message: "Title, description, and deadline are required" });
    }

    const task = new Task({
      title,
      description,
      deadline,
      linkedFile: req.file ? req.file.buffer : undefined,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task Status to DONE
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = 'DONE';
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task Details
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download Linked File
exports.downloadLinkedFile = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task || !task.linkedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="${task.title}.pdf"`);
    res.send(task.linkedFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Automatic Status Update Middleware
exports.updateStatusOnDeadline = async () => {
  try {
    const now = new Date();
    const tasks = await Task.find({ status: 'TODO', deadline: { $lt: now } });

    tasks.forEach(async (task) => {
      task.status = 'Failed';
      await task.save();
    });
  } catch (error) {
    console.error("Error updating task statuses:", error.message);
  }
};
