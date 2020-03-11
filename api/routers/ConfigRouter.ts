import { Router } from 'express';
import { COGNITO_CONFIG } from '../config';

const configRouter = Router();

configRouter.get('/api/config', (req, res) => {
  return res.send(COGNITO_CONFIG);
});

export { configRouter };
