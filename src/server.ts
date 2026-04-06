import express, { type Express } from 'express';
import env from './config/env.ts';
import morgan from 'morgan';
import { globalErrorHandler } from '@shared/middlewares/global.ts';
import { NotFoundError } from '@utils/errors.ts';
import { connectDB } from '@config/db.ts';

const server: Express = express();


if (env.NODE_ENV === 'development') {
  server.use(morgan('dev'));
}
server.use(express.json());



server.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});


server.use((_, __, next) => {
  next(new NotFoundError('Route not found'));
});


server.use(globalErrorHandler)

server.listen(env.PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});









