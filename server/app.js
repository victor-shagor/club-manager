import express from 'express';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';
import clubRouter from './routes/clubs';
import cors from 'cors'
import logger from "morgan";

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = process.env.PORT || 3002;
if (process.env.NODE_ENV !== 'test') {
app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});
}

app.use('/', usersRouter);
app.use('/', clubRouter);

app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Club Manager' }));
app.use('*', (req, res) => res.status(404).send({ message: 'route not found' }));

module.exports = app;
