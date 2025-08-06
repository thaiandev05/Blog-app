import { Body, Controller, Patch, Post, Put, Query, Req, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Request } from 'express';
import { diskStorage } from "multer";
import { FileValidationPipe } from "src/common/pipe/file.pipe";
import { EditDetailDto } from "./dto/EditDetailDto";
import { UserService } from "./user.service";
import { PostService } from "../post/post.service";
import { FileArrayValidationPipe } from "src/common/pipe/file-array.pipe";
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly postService: PostService
    ) { }

    @Put('change-detail')
    async changeDetail(@Req() req: Request, @Body() data: EditDetailDto) {
        return this.userService.editDetailUser(req, data)
    }

    @Patch('change-avt')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './upload',
            filename: (req, file, callback) => {
                const uniquename = `${Date.now()}-${file.originalname}`
                callback(null, uniquename)
            }
        })
    }))
    async changeAvt(@Req() req: Request, @UploadedFile(new FileValidationPipe()) file: Express.Multer.File) {
        return this.userService.changeAvt(req, file)
    }

    @Post('create-post')
    @UseInterceptors(AnyFilesInterceptor({
        storage: diskStorage({
            destination: './upload',
            filename: (req, files, callback) => {
                const uniquename = `${Date.now()}-${files.originalname}`
                callback(null, uniquename)
            }
        })
    }))
    async createPost(@Req() req: Request, @Body('content') content: string, @UploadedFiles(new FileArrayValidationPipe()) files: Array<Express.Multer.File>) {
        return this.postService.createPost(req, content, files)
    }

    @Put('edit-post')
    @UseInterceptors(AnyFilesInterceptor({
        storage: diskStorage({
            destination: './upload',
            filename: (req, files, callback) => {
                const uniquename = `${Date.now()}-${files.originalname}`
                callback(null, uniquename)
            }
        })
    }))
    async editPost(@Query('idPost') idPost: string, @Body('newContent') newContent: string, @Req() req: Request, @UploadedFiles(new FileArrayValidationPipe()) files: Array<Express.Multer.File>) {
        return this.postService.editPost(req, files, newContent, idPost)
    }
}