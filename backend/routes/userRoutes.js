const express = require('express');
const router = express.Router();
const User = require('../models/User');

// CREATE a user
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.create({ name, email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name;
    user.email = email;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
