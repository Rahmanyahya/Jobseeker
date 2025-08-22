import { AccountController } from 'Bin/Account/Account.controller';
import { ApplicantController } from 'Bin/Applicant/Appliciant.controller';
import { AuthController } from 'Bin/Auth/Auth.controller';
import { CompanyController } from 'Bin/Company/Company.controller';
import { JobController } from 'Bin/Job/Job.controller';
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
 * Auth Router
 *
 */

// Logout
PrivateRouter.post(
  `${Prefix}/logout`,
  AuthorizationMiddleware('SOCIETY', 'HRD'),
  AuthController.Logout
);

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

/**
 *
 * Company Routes
 *
 */

// Add Company
PrivateRouter.post(
  `${Prefix}/company`,
  AuthorizationMiddleware('HRD'),
  CompanyController.addCompany
);

// Update Company
PrivateRouter.put(
  `${Prefix}/company`,
  AuthorizationMiddleware('HRD'),
  CompanyController.updateCompany
);

// Get Company
PrivateRouter.get(
  `${Prefix}/company`,
  AuthorizationMiddleware('HRD'),
  CompanyController.getCompany
);

/**
 *
 * Jobs Routes
 *
 */

// Get All Jobs
PrivateRouter.get(
  `${Prefix}/jobs-recruitment`,
  AuthorizationMiddleware('HRD'),
  JobController.getJobs
);

// Get Job Detail
PrivateRouter.get(
  `${Prefix}/job-detail-recruitment`,
  AuthorizationMiddleware('HRD'),
  JobController.getJobById
);

// Create Job
PrivateRouter.post(`${Prefix}/job`, AuthorizationMiddleware('HRD'), JobController.createJob);

// Update Job
PrivateRouter.put(`${Prefix}/job`, AuthorizationMiddleware('HRD'), JobController.updateJob);

// Delete Job
PrivateRouter.delete(`${Prefix}/job`, AuthorizationMiddleware('HRD'), JobController.deleteJob);

/**
 *
 * Application Routes
 *
 */

// Apply Job
PrivateRouter.post(
  `${Prefix}/apply`,
  AuthorizationMiddleware('SOCIETY'),
  ApplicantController.applyJob
);

// Get History Apply
PrivateRouter.get(
  `${Prefix}/apply-history`,
  AuthorizationMiddleware('SOCIETY'),
  ApplicantController.getHistoryAppliciant
);

// Cancel History Apply
PrivateRouter.delete(
  `${Prefix}/apply`,
  AuthorizationMiddleware('SOCIETY'),
  ApplicantController.cancelApply
);

// Edit History Apply
PrivateRouter.put(`${Prefix}/apply`, AuthorizationMiddleware('HRD'), ApplicantController.editApply);

// Get Job Detail
PrivateRouter.get(
  `${Prefix}/apply-detail`,
  AuthorizationMiddleware('HRD'),
  ApplicantController.jobAppliciantDetail
);

// Get Appliciant List
PrivateRouter.get(
  `${Prefix}/apply-list`,
  AuthorizationMiddleware('HRD'),
  ApplicantController.jobApplicinatList
);

export default PrivateRouter;
