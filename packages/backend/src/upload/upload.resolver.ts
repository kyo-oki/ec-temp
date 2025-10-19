import { Resolver, Mutation } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { UploadService } from './upload.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadResult } from './dto/upload-result.dto';

@Resolver()
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  @Mutation(() => UploadResult)
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResult> {
    return await this.uploadService.processUpload(file);
  }
}
