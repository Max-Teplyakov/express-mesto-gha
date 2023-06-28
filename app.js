const express = require('express');
const mongoose = require('mongoose');

const app = express();
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const auth = require('./middlewares/auth');
const {
  ERROR_NOT_FOUND,
} = require('./utils/utils');
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

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Error Server' });
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
