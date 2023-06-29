/* eslint-disable consistent-return */
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {
  ERROR_VALIDATION,
  ERROR_SERVER,
  OK_SERVER,
} = require('../utils/utils');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
    // создадим токен
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      // вернём токен
      if (!user) {
        throw new UnauthorizedError('Error Data');
      }
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(OK_SERVER).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return next(new ValidationError('Error Data')); }
      if (err.code === 11000) { return next(new ConflictError('Email Already Exists')); }
      return res.status(ERROR_SERVER).send({ message: 'Error Server' });
    });
};

module.exports.getUsers = (req, res) => User.find({})
  .then((user) => res.status(OK_SERVER).send({ data: user }))
  .catch(() => res.status(ERROR_SERVER).send({ message: 'Error Server' }));

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.status(OK_SERVER).send({ data: user });
    })
    .catch(next);
};

module.exports.getUsersId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.status(OK_SERVER).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Incorrect ID'));
      }
      return next(err);
    });
};

module.exports.updateProfileUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(OK_SERVER).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(ERROR_VALIDATION).send({ message: 'Validation Error' }); }
      return next(err);
    });
};

module.exports.updateAvatarUser = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(OK_SERVER).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return next(new ValidationError('Incorrect ID')); }
      return next(err);
    });
};
