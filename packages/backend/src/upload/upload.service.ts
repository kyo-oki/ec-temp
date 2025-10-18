import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadResult } from './dto/upload-result.dto';
import { put } from '@vercel/blob';

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

  async uploadToVercelBlob(file: Express.Multer.File): Promise<string> {
    try {
      const blob = await put(file.originalname, file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return blob.url;
    } catch {
      throw new BadRequestException('Failed to upload file to cloud storage');
    }
  }

  async processUpload(file: Express.Multer.File): Promise<UploadResult> {
    this.validateFile(file);

    // Use Vercel Blob in production, local storage in development
    const isProduction = process.env.NODE_ENV === 'production';
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    let fileUrl: string;
    if (isProduction && hasBlobToken) {
      fileUrl = await this.uploadToVercelBlob(file);
    } else {
      fileUrl = this.generateFileUrl(file.filename);
    }

    return {
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
