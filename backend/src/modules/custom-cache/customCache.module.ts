import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { CacheableMemory, Keyv } from 'cacheable';
import { CustomCacheService } from './customCache.service';
@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => {
                return {
                    stores: [
                        new Keyv({
                            store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                        }),
                        createKeyv('redis://localhost:6379'),
                    ],
                };
            },
        }),
    ],
    providers: [CustomCacheService],
    exports: [CustomCacheService, CacheModule]
})
export class CustomCacheModule { }
