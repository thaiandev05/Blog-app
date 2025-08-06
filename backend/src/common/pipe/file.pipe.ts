import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileValidationPipe implements PipeTransform {

    transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
        const maxSize = 1000 * 1024

        if(file.size > maxSize){
            throw new BadRequestException('File over size')
        }
        return file
    }
    
}