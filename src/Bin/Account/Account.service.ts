import { Validator } from 'Helper/Validator';
import { AddProfile, RegisterAccount, UpdateProfile } from 'Types/Account.types';
import { AccountSchema } from './Account.schema';
import { AccountRepository } from './Account.repository';
import Logger from 'Config/Logger';
import { CloudinaryService } from 'Config/Clodinary';
import { ErrorHandler } from 'Global/Global';
import { HttpErrorCode } from 'Constant/HttpError';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

export class AccountService {
  static async register(payload: RegisterAccount): Promise<void> {
    const ctx: string = 'Register Account';
    const scp: string = 'Account';

    const userRequest = Validator.Validate(AccountSchema.REGISTER, payload);

    const isAccountRegistered = await AccountRepository.findOne({ email: userRequest.email });

    if (isAccountRegistered) {
      Logger.info(ctx, `Account already registered`, scp);
      throw new ErrorHandler(HttpErrorCode.BAD_REQUEST, 'Account already registered');
    }

    const { public_id, secure_url } = await CloudinaryService.uploadImage(payload.avatar as Buffer);

    userRequest.password = await bcrypt.hash(userRequest.password, 10);

    await AccountRepository.createAccount({
      email: userRequest.email,
      password: userRequest.password,
      name: userRequest.name,
      role: userRequest.role,
      avatar: secure_url,
      avatar_public_id: public_id,
    });

    Logger.info(ctx, `Account registered`, scp);
  }

  static async addProfile(payload: AddProfile, userId: number): Promise<void> {
    const ctx: string = 'Add Profile';
    const scp: string = 'Account';

    const userRequest = Validator.Validate(AccountSchema.ADD_PROFILE, payload);

    userRequest.userId = userId;

    const { name } = await AccountRepository.findOne({ id: userRequest.userId });

    await AccountRepository.create({
      user: { connect: { id: userRequest.userId } },
      name,
      address: userRequest.address,
      phone: userRequest.phone,
      dob: userRequest.dob,
      gender: userRequest.gender,
    });

    Logger.info(ctx, `Profile added`, scp);
  }

  static async editProfile(payload: UpdateProfile, userId: number): Promise<void> {
    const ctx: string = 'Edit Profile';
    const scp: string = 'Account';

    const userRequest = Validator.Validate(AccountSchema.EDIT_PROFILE, payload);

    userRequest.userId = userId;

    const userProfile = await AccountRepository.findOne({ id: userRequest.userId });

    if (
      userRequest.email ||
      userRequest.password ||
      userRequest.password ||
      userRequest.name ||
      payload.avatar
    ) {
      if (payload.avatar) {
        const { public_id, secure_url } = await CloudinaryService.uploadImage(
          payload.avatar as Buffer
        );

        await CloudinaryService.deleteImage(userProfile.avatar_public_id!);
        userProfile.avatar_public_id = public_id;
        userProfile.avatar = secure_url;
      }

      if (userRequest.password) userRequest.password = await bcrypt.hash(userRequest.password, 10);

      await AccountRepository.updateAccount(
        {
          email: userRequest.email,
          password: userRequest.password,
          name: userRequest.name,
          avatar: userProfile.avatar,
          avatar_public_id: userProfile.avatar_public_id,
        },
        { id: userRequest.userId }
      );
    }

    if (userProfile.Society)
      await AccountRepository.update(
        {
          address: userRequest.address,
          phone: userRequest.phone,
          dob: userRequest.dob,
          gender: userRequest.gender,
          name: userRequest.name,
        },
        { userId: userRequest.userId }
      );

    Logger.info(ctx, `Profile updated`, scp);
  }

  static async deleteAccount(userId: number): Promise<void> {
    const ctx: string = 'Delete Account';
    const scp: string = 'Account';

    const { avatar_public_id } = await AccountRepository.delete({ id: userId });

    await CloudinaryService.deleteImage(avatar_public_id!);

    Logger.info(ctx, `Account deleted`, scp);
  }

  static async getProfile(userId: number): Promise<{
    id: number;
    email: string;
    name: string;
    address: string;
    phone: string;
    dob?: Date;
    gender: string;
    avatar: string;
  }> {
    const ctx: string = 'Get Profile';
    const scp: string = 'Account';

    const userProfile = await AccountRepository.findOne({ id: userId });

    Logger.info(ctx, `Profile fetched`, scp);

    return {
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      address: userProfile.Society?.address || '',
      phone: userProfile.Society?.phone || '',
      dob: userProfile.Society?.dob,
      gender: userProfile.Society?.gender || '',
      avatar: userProfile.avatar,
    };
  }
}
