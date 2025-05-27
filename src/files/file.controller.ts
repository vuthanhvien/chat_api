import { Controller, Post, UploadedFile } from '@nestjs/common';
import { File as MulterFile } from 'multer';

@Controller('files')
export class FileController {
  @Post('store')
  async storeFile(@UploadedFile() file: MulterFile) {
    if (!file) {
      return {
        message: 'No file uploaded',
        status: 'error',
        code: 400,
      };
    }
    return {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
