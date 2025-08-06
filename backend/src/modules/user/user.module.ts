import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PostModule } from '../post/post.module';

@Module({
    imports: [
        PostModule,
        MulterModule.registerAsync({
            useFactory: () => ({
                dest: './upload',
            }),
        })
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }
