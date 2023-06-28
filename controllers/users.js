/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  OK_SERVER,
} = require('../utils/utils');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
    // создадим токен
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(OK_SERVER).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(ERROR_VALIDATION).send({ message: 'Error Data' }); }
      return res.status(ERROR_SERVER).send({ message: 'Error Server' });
    });
};

module.exports.getUsers = (req, res) => User.find({})
  .then((user) => res.status(OK_SERVER).send({ data: user }))
  .catch(() => res.status(ERROR_SERVER).send({ message: 'Error Server' }));

module.exports.getUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'User not found' });
      }
      res.status(OK_SERVER).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Validation Error' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Error Server' });
    });
};

module.exports.getUsersId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'User not found' });
      }
      res.status(OK_SERVER).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Validation Error' });
        return;
      }
      res.status(ERROR_SERVER).send({ message: 'Error Server' });
    });
};

module.exports.updateProfileUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(OK_SERVER).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(ERROR_VALIDATION).send({ message: 'Validation Error' }); }
      return res.status(ERROR_SERVER).send({ message: 'Error Server' });
    });
};

module.exports.updateAvatarUser = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(OK_SERVER).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(ERROR_VALIDATION).send({ message: 'Error Data' }); }
      return res.status(ERROR_SERVER).send({ message: 'Error Server' });
    });
};
