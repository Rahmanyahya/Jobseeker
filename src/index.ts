import express from 'express';
import helmet from 'helmet';
import { GlobalEnv } from './Config/GlobalEnv';
import PublicRouter from 'App/Public.routes';
import { ErrorMiddleware } from 'Middleware/Error.middleware';
import { initialRedisClient } from 'Config/Redis';

const app = express();

app.use([express.json(), express.urlencoded({ extended: true }), helmet()]);

initialRedisClient();

app.use(PublicRouter);

app.use(ErrorMiddleware);

app.listen(GlobalEnv.PORT, () => console.log(`Server running on port ${GlobalEnv.PORT}`));

export default app;
