/* eslint-disable consistent-return */
const User = require('../models/users');

module.exports.getUsers = (req, res) => User.find({})
  .then((user) => res.status(200).send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Error Server' }));

module.exports.getUsersId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Validation Error' });
        return;
      }
      res.status(500).send({ message: 'Error Server' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Error Data' }); }
      return res.status(500).send({ message: 'Error Server' });
    });
};

module.exports.updateProfileUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Validation Error' }); }
      return res.status(500).send({ message: 'Error Server' });
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Error Data' }); }
      return res.status(500).send({ message: 'Error Server' });
    });
};
