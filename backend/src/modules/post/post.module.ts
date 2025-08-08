import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { CustomCacheModule } from '../custom-cache/customCache.module';

@Module({
    imports: [CustomCacheModule],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule {}
