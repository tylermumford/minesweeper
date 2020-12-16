import express, { json, urlencoded } from 'express';
import path, { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import gamesRouter from './routes/games.js';

let app = express();
let pwd = path.resolve();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(pwd, 'public')));

app.use('/', indexRouter);
app.use('/games', gamesRouter);

export default app;
