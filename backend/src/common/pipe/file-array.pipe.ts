import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileArrayValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {
    const maxSize = 1000 * 1024;

    for (const file of files) {
      if (file.size > maxSize) {
        throw new BadRequestException(`File ${file.originalname} over size 5KB`);
      }
    }

    return files; 
  }
}
