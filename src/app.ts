import express from 'express';
import mongoose from 'mongoose';
import redis from 'redis';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import config from './utils/config';
import logger from './utils/logger';
import errorHandler from './middleware/errorHandler';
import unknownEndpoint from './middleware/unknownEndpoint';
import apiRouter from './routes';

const redisClient = redis.createClient({
  url: config.REDIS_URI,
  password: config.REDIS_PASSWORD || undefined,
  port: 6379,
});
const app = express();

redisClient.on('connect', () => {
  logger.info('Connected to redis server');
});

mongoose
  .connect(config.MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('Connected to mongodb database');
  })
  .catch((err) => logger.error('Could not connect to mongodb:', err));

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api/v1', apiRouter);

app.get('/', (_req, res) => {
  res.send('Hello!');
});

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;