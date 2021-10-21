import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { S3Service } from './s3.service';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [S3Service, FilesService],
})
export class FilesModule {}
