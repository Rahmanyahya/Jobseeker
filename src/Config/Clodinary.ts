import * as Cloud from 'cloudinary';
import { GlobalEnv } from './GlobalEnv';

Cloud.v2.config({
  cloud_name: GlobalEnv.CLOUDINARY.CLOUD_NAME,
  api_key: GlobalEnv.CLOUDINARY.API_KEY,
  api_secret: GlobalEnv.CLOUDINARY.SECRET_KEY,
  secure: true,
});

export class CloudinaryService {
  private static cloudinary = Cloud.v2;

  static async uploadImage(image: Buffer): Promise<{
    secure_url: string;
    public_id: string;
  }> {
    const { secure_url, public_id } = await this.cloudinary.uploader.upload(
      `data:image/jpeg;base64,${image.toString('base64')}`,
      {
        folder: 'ukk',
      }
    );

    return {
      secure_url,
      public_id,
    };
  }

  static async deleteImage(public_id: string): Promise<void> {
    await this.cloudinary.uploader.destroy(public_id);
  }
}
