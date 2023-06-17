const Card = require('../models/cards');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') { return res.status(400).send({ message: 'Error Data' }); }
      return res.status(500).send({ message: 'Error Server' });
    });
};

module.exports.getCards = (req, res) => Card.find({})
  .then((card) => res.status(200).send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Error Server' }));

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') { return res.status(400).send({ message: 'Card not found' }); }
      return res.status(500).send({ message: 'Error Server' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(400).send({ message: 'Card not found' });
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') { return res.status(404).send({ message: 'Card not found' }); }
    return res.status(500).send({ message: 'Error Server' });
  });

module.exports.disLikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') { return res.status(404).send({ message: 'Card not found' }); }
    return res.status(500).send({ message: 'Error Server' });
  });
