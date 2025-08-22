import { ClientRequest } from 'Global/Global';
import { Login } from 'Types/Auth.types';
import { NextFunction, Response } from 'express';
import { HttpSuccessCode, HttpSuccessMessage } from 'Constant/HttpSuccess';
import { Wrapper } from 'Utils/Wrapper';
import { AuthService } from './Auth.service';

export class AuthController {
  static async Login(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: Login = req.body as Login;

      const response = await AuthService.Login(request);

      Wrapper.success(res, response, HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }

  static async Logout(req: ClientRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.Logout(req.user!.id!);

      Wrapper.success(res, [], HttpSuccessMessage.OK, HttpSuccessCode.OK);
    } catch (e) {
      next(e);
    }
  }
}
