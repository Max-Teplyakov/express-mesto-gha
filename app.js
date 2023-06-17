const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');

const app = express();
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected bd');
  });

app.use((req, res, next) => {
  req.user = {
    _id: '648b86986f58776347cb1b59', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);
app.use((req, res) => {
  res.status(404).send({ message: 'Error Server' });
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
