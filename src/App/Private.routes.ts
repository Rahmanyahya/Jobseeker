import { AccountController } from 'Bin/Account/Account.controller';
import { PortfolioController } from 'Bin/Portfolio/Portfolio.controller';
import { GlobalEnv } from 'Config/GlobalEnv';
import { upload } from 'Config/Multer';
import { Router } from 'express';
import { AuthorizationMiddleware } from 'Middleware/Athorization.middleware';
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

/**
 *
 * Portfolio Routes
 *
 */

// Add Portfolio
PrivateRouter.post(
  `${Prefix}/portfolio`,
  AuthorizationMiddleware('SOCIETY'),
  upload.single('file'),
  PortfolioController.addPortfolio
);

// Update Portfolio
PrivateRouter.put(
  `${Prefix}/portfolio`,
  AuthorizationMiddleware('SOCIETY'),
  upload.single('file'),
  PortfolioController.updatePortfolio
);

// Get Portfolio
PrivateRouter.get(
  `${Prefix}/portfolio-detail`,
  AuthorizationMiddleware('SOCIETY'),
  PortfolioController.getPortfolioById
);

// Delete Portfolio
PrivateRouter.delete(
  `${Prefix}/portfolio`,
  AuthorizationMiddleware('SOCIETY'),
  PortfolioController.deletPortfolio
);

// Get All Portfolio
PrivateRouter.get(
  `${Prefix}/portfolio`,
  AuthorizationMiddleware('SOCIETY'),
  PortfolioController.getAllPortfolio
);

export default PrivateRouter;
