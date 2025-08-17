import { AuthController } from 'Bin/Auth/Auth.controller';
import { AuthService } from 'Bin/Auth/Auth.service';
import { HttpSuccessMessage } from 'Constant/HttpSuccess';
import { NextFunction, Response } from 'express';
import { ClientRequest } from 'Global/Global';
import { describe } from 'node:test';
import { Wrapper } from 'Utils/Wrapper';

describe('AuthController.Login', () => {
  const mockReq: object = {
    body: {
      email: 'a@a.com',
      password: '1234',
    },
  };

  const mockRes: object = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const mockNext = jest.fn();

  it('should return success response when login is successful', async () => {
    jest.spyOn(AuthService, 'Login').mockResolvedValue({ role: 'SOCIETY', token: 'token' });
    jest.spyOn(Wrapper, 'success');

    await AuthController.Login(
      mockReq as ClientRequest,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(AuthService.Login).toHaveBeenCalledWith({ email: 'a@a.com', password: '1234' });
    expect(Wrapper.success).toHaveBeenCalledWith(
      mockRes as Response,
      { role: 'SOCIETY', token: 'token' },
      HttpSuccessMessage.OK,
      200
    );
  });

  it('should call next when error occurs', async () => {
    const error = new Error('Login failed');
    jest.spyOn(AuthService, 'Login').mockRejectedValue(error);

    await AuthController.Login(
      mockReq as ClientRequest,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
