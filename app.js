const express = require('express');
const { default: mongoose } = require('mongoose');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users'); // импортируем роутер
const cardRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/user');
const { auth } = require('./middlewares/auth');
const validateUser = require('./middlewares/validateUser');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/signup', express.json(), validateUser, createUser);

app.post('/signin', express.json(), validateUser, login);

app.use(auth);

app.use('/', userRoutes);

app.use('/', cardRoutes);

app.get('*', (req, res) => {
  res.status(404).send({
    message: 'Страница не была найдена',
  });
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT);
