import { Validator } from 'Helper/Validator';
import { Login } from 'Types/Auth.types';
import { AuthSchema } from './Auth.schema';
import { AuthRepository } from './Auth.repository';
import { ErrorHandler } from 'Global/Global';
import { HttpErrorCode, HttpErrorMessage } from 'Constant/HttpError';
import bcrypt from 'bcrypt';
import Logger from 'Config/Logger';
import { JwtService } from 'Helper/Jwt';
import { initialRedisClient } from 'Config/Redis';
import { ROLE } from '@prisma/client';

export class AuthService {
  static async Login(payload: Login): Promise<{ role: ROLE; token: string }> {
    const ctx: string = 'Login';
    const scp: string = 'User';

    const userRequest = Validator.Validate(AuthSchema.LOGIN, payload);

    const user = await AuthRepository.getUserByEmail({ email: userRequest.email });

    if (!user) {
      Logger.info(ctx, `User not found`, scp);
      throw new ErrorHandler(HttpErrorCode.NOT_FOUND, HttpErrorMessage.NOT_FOUND);
    }

    if (!(await bcrypt.compare(userRequest.password, user.password))) {
      Logger.info(ctx, `Invalid password`, scp);
      throw new ErrorHandler(HttpErrorCode.BAD_REQUEST, 'Invalid password');
    }

    const token = await JwtService.createToken({ id: user.id, role: user.role });

    return { role: user.role, token };
  }
}
