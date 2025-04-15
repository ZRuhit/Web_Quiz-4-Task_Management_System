// Update task
router.put('/:id', auth, async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: req.body },
        { new: true }
      );
      
      if (!task) return res.status(404).json({ msg: 'Task not found' });
      
      res.json(task);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
  
  // Delete task
  router.delete('/:id', auth, async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
      });
      
      if (!task) return res.status(404).json({ msg: 'Task not found' });
      
      res.json({ msg: 'Task removed' });
    } catch (err) {
      res.status(500).send('Server error');
    }
  });