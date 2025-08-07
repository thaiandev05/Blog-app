import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PostModule } from '../post/post.module';
import { CustomCacheModule } from '../custom-cache/customCache.module';

@Module({
    imports: [
        PostModule,
        MulterModule.registerAsync({
            useFactory: () => ({
                dest: './upload',
            }),
        }),
        CustomCacheModule
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule { }
