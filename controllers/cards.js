const {
  ERROR_VALIDATION,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
} = require('util');

/* eslint-disable consistent-return */
const Card = require('../models/cards');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(ERROR_VALIDATION).send({ message: 'Error Data' }); }
      return res.status(ERROR_SERVER).send({ message: 'Error Server' });
    });
};

module.exports.getCards = (req, res) => Card.find({})
  .then((card) => res.status(200).send({ data: card }))
  .catch(() => res.status(ERROR_SERVER).send({ message: 'Error Server' }));

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Card not found' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(ERROR_VALIDATION).send({ message: 'Error Data' }); }
      return res.status(ERROR_SERVER).send({ message: 'Error Server' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Card not found' });
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') { return res.status(ERROR_VALIDATION).send({ message: 'Error Data' }); }
    return res.status(ERROR_SERVER).send({ message: 'Error Server' });
  });

module.exports.disLikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(ERROR_NOT_FOUND).send({ message: 'Card not found' });
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') { return res.status(ERROR_VALIDATION).send({ message: 'Error Data' }); }
    return res.status(ERROR_SERVER).send({ message: 'Error Server' });
  });
