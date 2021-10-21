import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { imageSize } from 'image-size';
import { extname, join } from 'path';
import { S3Service } from './s3.service';
import * as sharp from 'sharp';

@Injectable()
export class FilesService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer } = file;
    const uuid = randomUUID();
    const ext = extname(originalname);

    // 원본 저장
    await this.s3Service.uploadImage(
      `${join('images', 'origin')}/${uuid}${ext}`,
      buffer,
    );

    // resize 이미지 저장
    const { width } = imageSize(buffer);
    const dimention = width > 1280 ? { width: 1280 } : {};

    const resizedBuffer = await sharp(buffer)
      .rotate(null)
      .resize({
        ...dimention,
        fit: 'outside',
      })
      .toBuffer();

    await this.s3Service.uploadImage(
      `${join('images', 'resized')}/${uuid}${ext}`,
      resizedBuffer,
      'public-read',
    );

    return `https://${process.env.AWS_S3_BUCKET}.s3.${
      process.env.AWS_S3_REGION
    }.amazonaws.com/${join('images', 'resized')}/${uuid}${ext}`;
  }
}
