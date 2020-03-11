import { Router } from 'express';
import { logger } from '../logger';

const loggingRouter = Router();

loggingRouter.post('/api/log', (req, res) => {
  logger.log(req.body);
  return res.sendStatus(200);
});

export { loggingRouter };
