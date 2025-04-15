// server/routes/tasks.js
import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js'; // Ensure this middleware is implemented to authenticate user
import { check, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('dueDate', 'Please include a valid due date').isISO8601(),
  check('priority', 'Priority is required').isIn(['Low', 'Medium', 'High']),
  check('category', 'Category is required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, dueDate, priority, category } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      category,
      user: req.user.id,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err.message);
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, dueDate, priority, category, isCompleted } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check if the task belongs to the authenticated user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.category = category || task.category;
    task.isCompleted = isCompleted === undefined ? task.isCompleted : isCompleted;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Check if the task belongs to the authenticated user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
