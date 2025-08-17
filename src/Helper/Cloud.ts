import { Cloudinary } from 'Config/Clodinary';

export class CloudService {
  static async uploadImage(image: Buffer): Promise<{
    secure_url: string;
    public_id: string;
  }> {
    const { secure_url, public_id } = await Cloudinary.uploader.upload(
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
    await Cloudinary.uploader.destroy(public_id);
  }
}
