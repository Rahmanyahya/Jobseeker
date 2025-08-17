import { AuthController } from 'Bin/Auth/Auth.controller';
import { GlobalEnv } from 'Config/GlobalEnv';
import { Router } from 'express';

const PublicRouter = Router();
const Prefix = GlobalEnv.PREFIX;

// Login
PublicRouter.post(`${Prefix}/login`, AuthController.Login);

export default PublicRouter;
