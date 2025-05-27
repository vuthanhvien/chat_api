import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('files')
export class FileController {
  @Post('store')
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Endpoint to upload a file to the server.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Thư mục lưu file
        filename: (req, file, cb) => {
          // Đặt tên file lưu trữ
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async storeFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return {
        message: 'No file uploaded',
        status: 'error',
        code: 400,
      };
    }

    // this.fileService.

    return {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path,
    };
  }
}
