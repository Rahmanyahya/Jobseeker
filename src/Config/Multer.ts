import multer from 'multer';

export const multerOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
};

export const upload = multer(multerOptions);
