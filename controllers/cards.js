const {
  OK_SERVER,
} = require('../utils/utils');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

/* eslint-disable consistent-return */
const Card = require('../models/cards');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  Card.create({ name, link, owner: userId })
    .then((card) => res.status(OK_SERVER).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return next(new ValidationError('Error Data')); }
      return next(err);
    });
};

module.exports.getCards = (req, res, next) => Card.find({})
  .then((card) => res.status(OK_SERVER).send({ data: card }))
  .catch(next);

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('You have no rights');
      }
      res.status(OK_SERVER).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') { return next(new ValidationError('Error Data')); }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Card not found');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') { return next(new ValidationError('Error Data')); }
    return next(err);
  });

module.exports.disLikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Card not found');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') { return next(new ValidationError('Error Data')); }
    return next(err);
  });
