const express = require('express');
const taskController = require('../controllers/taskController');
const multer = require('multer');
const router = express.Router();

// Configure multer for handling file uploads
const upload = multer();

// Route to get all tasks
router.get('/', taskController.getTasks);

// Route to get a specific task by ID
router.get('/:id', taskController.getTaskById);

// Route to create a new task (includes file upload if present)
router.post('/', upload.single('linkedFile'), taskController.createTask);

// Route to update the status of a task to DONE
router.patch('/:id/status', taskController.updateTaskStatus);

// Route to update a task's details
router.put('/:id', taskController.updateTask);

// Route to delete a task
router.delete('/:id', taskController.deleteTask);

// Route to download a linked file of a task
router.get('/:id/download', taskController.downloadLinkedFile);

module.exports = router;
