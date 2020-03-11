import express from 'express';

import { logger } from './logger';
import { PORT } from './config';

import { configRouter } from './routers/ConfigRouter';
import { loggingRouter } from './routers/LoggingRouter';
import { eksRouter } from './routers/EksRouter';

const app = express();

app.use(express.json());

app.use(configRouter);
app.use(loggingRouter);
app.use(eksRouter);

app.listen(PORT, () => {
  logger.info(`application server started on port ${PORT}`);
});
