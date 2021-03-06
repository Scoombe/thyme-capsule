// @flow

import express from 'express';
import bodyParser from 'body-parser';

import catchError from './middleware';
import { initialized, authJwt } from './passport';
import sequelize from './database';

import { login, register, refreshToken } from './user';
import { saveJson, retrieveJson } from './files';

const app = express();

// Register middleware
app.use(initialized);
app.use(bodyParser.json());

// User endpoints
app.post('/register', catchError(400, register));
app.post('/login', catchError(401, login));
app.post('/refresh-token', authJwt, catchError(401, refreshToken));

// File endpoints
app.post('/save-state', authJwt, catchError(400, saveJson));
app.get('/get-state', authJwt, catchError(404, retrieveJson));

const port = process.env.PORT || 4000;

// eslint-disable-next-line no-console
app.listen(port, async () => {
  await sequelize.sync();
  console.info(`Server started on port ${port}`);
});
