import { Module } from '@nestjs/common';
import { CustomCacheService } from './customCache.service';

@Module({
    providers: [CustomCacheService],
    exports: [CustomCacheService]
})
export class CustomCacheModule {}
