import request from 'supertest';
import { ROLE } from '@prisma/client';
import { GlobalEnv } from 'Config/GlobalEnv';
import { HttpSuccessCode, HttpSuccessMessage } from 'Constant/HttpSuccess';
import { HttpErrorCode, HttpErrorMessage } from 'Constant/HttpError';
import app from 'index';

var prefix = GlobalEnv.PREFIX;

describe('POST /login', () => {
  it('should return 200 when login is successful', async () => {
    const res = await request(app).post(`${prefix}/login`).send({
      email: 'rahmanyahya647@gmail.com',
      password: '12345678',
    });

    expect(res.statusCode).toBe(HttpSuccessCode.OK);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('success');
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data).toHaveProperty('role');
    expect(res.body.data.role).toBe(ROLE.SOCIETY);
    expect(res.body.data.token).not.toBeNull();
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe(HttpSuccessMessage.OK);
  });

  it('should return 400 when password is invalid', async () => {
    const res = await request(app).post(`${prefix}/login`).send({
      email: 'rahmanyahya647@gmail.com',
      password: '12345679',
    });

    expect(res.statusCode).toBe(HttpErrorCode.BAD_REQUEST);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid password');
  });

  it('should return 404 when user not found', async () => {
    const res = await request(app).post(`${prefix}/login`).send({
      email: 'rahmanyahya648@gmail.com',
      password: '12345679',
    });

    expect(res.statusCode).toBe(HttpErrorCode.NOT_FOUND);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(HttpErrorMessage.NOT_FOUND);
    console.log(res.body);
  });

  it('should return 400 when input invalid', async () => {
    const res = await request(app).post(`${prefix}/login`).send({
      email: '',
      password: '',
    });

    expect(res.statusCode).toBe(HttpErrorCode.BAD_REQUEST);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('errors');
    expect(res.body.success).toBe(false);
    expect(res.body.errors).not.toBe([]);
  });
});
