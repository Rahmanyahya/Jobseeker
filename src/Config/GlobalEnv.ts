import 'dotenv/config';

export const GlobalEnv = {
  PREFIX: process.env.PREFIX,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS: {
    USERNAME: process.env.REDIS_USERNAME,
    PASSWORD: process.env.REDIS_PASSWORD,
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUD_NAME,
    FOLDER_NAME: process.env.FOLDER_NAME,
    API_KEY: process.env.CLOUD_API_KEY,
    SECRET_KEY: process.env.CLOUD_API_SECRET,
  },
  AES_KEY: process.env.AES_KEY,
  MODE: process.env.MODE,
};
