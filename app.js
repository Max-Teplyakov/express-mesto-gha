const express = require('express');
const mongoose = require('mongoose');

const app = express();
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const {
  ERROR_NOT_FOUND,
} = require('./utils/utils');

const { PORT = 3000 } = process.env;

app.use(express.json());

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

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Error Server' });
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
