import { AccountController } from 'Bin/Account/Account.controller';
import { AuthController } from 'Bin/Auth/Auth.controller';
import { JobController } from 'Bin/Job/Job.controller';
import { GlobalEnv } from 'Config/GlobalEnv';
import { upload } from 'Config/Multer';
import { Router } from 'express';

const PublicRouter = Router();
const Prefix = GlobalEnv.PREFIX;

// Login
PublicRouter.post(`${Prefix}/login`, AuthController.Login);

// Register
PublicRouter.post(`${Prefix}/register`, upload.single('avatar'), AccountController.register);

// Jobs
PublicRouter.get(`${Prefix}/jobs`, JobController.getJobs);

// Job Detail
PublicRouter.get(`${Prefix}/job-detail`, JobController.getJobById);

export default PublicRouter;
