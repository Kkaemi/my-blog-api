import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ObjectCannedACL } from '@aws-sdk/client-s3/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_S3_REGION,
  });

  async uploadImage(
    key: string,
    body: Buffer,
    acl?: ObjectCannedACL,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: body,
      ACL: acl,
    });
    await this.client.send(command);
  }
}
