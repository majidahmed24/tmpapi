const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateIDCode = require('../service/idCode');

exports.createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;

    const user = new User({
      ...rest,
      ...(hashed && { password: hashed })
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const { password, ...rest } = req.body;
  const updatedFields = {
    ...rest,
    ...(password && { password: await bcrypt.hash(password, 10) })
  };

  const user = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.json({ msg: 'User deleted' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password || '');
  if (!isMatch) return res.status(401).json({ msg: 'Invalid email or password' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user });
};