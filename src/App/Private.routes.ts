import { AccountController } from 'Bin/Account/Account.controller';
import { GlobalEnv } from 'Config/GlobalEnv';
import { upload } from 'Config/Multer';
import { Router } from 'express';
import { JwtMiddleware } from 'Middleware/Jwt.middleware';

const Prefix = GlobalEnv.PREFIX;
const PrivateRouter = Router();

PrivateRouter.use(JwtMiddleware);

/**
 *
 * Profile Routes
 *
 */

// Add Profile
PrivateRouter.post(`${Prefix}/profile`, AccountController.addProfile);

// Update Profile
PrivateRouter.put(`${Prefix}/profile`, upload.single('avatar'), AccountController.updateProfile);

// Get Profile
PrivateRouter.get(`${Prefix}/profile`, AccountController.getProfile);

// Delete Profile
PrivateRouter.delete(`${Prefix}/profile`, AccountController.deleteProfile);

export default PrivateRouter;
