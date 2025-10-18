import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadResult } from './dto/upload-result.dto';

@Injectable()
export class UploadService {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size ${file.size} exceeds maximum allowed size of ${this.maxFileSize} bytes`,
      );
    }
  }

  generateFileUrl(filename: string): string {
    // In production, this would be the actual domain/CDN URL
    return `/uploads/${filename}`;
  }

  processUpload(file: Express.Multer.File): UploadResult {
    this.validateFile(file);

    return {
      url: this.generateFileUrl(file.filename),
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
