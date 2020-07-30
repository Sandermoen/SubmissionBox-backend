import { RequestHandler } from 'express';

const tokenExtractor: RequestHandler = (req, _, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

export default tokenExtractor;