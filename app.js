const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const app = express();

const auth = require('./middlewares/auth');
const routes = require('./routes/index');
const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected bd');
  });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/^https?:\/\/[\w\-\.\/~:\?\#\[\]@!$&'\(\)\*\+,;=]+[\-.\/~:\?\#\[\]@!$&'\\(\)\*\+,;=]{1}[\w\-\.\/~:\?\#\[\]@!$&'\(\)\*\+,;=]+[#\/]?$/),
    email: Joi.string().required().pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use(routes);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
