import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CustomCacheService {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    // get or set cache
    async getOrSet<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {

        // check available cache 
        const cache = await this.cacheManager.get<T>(key)

        if(cache) return cache

        const data = await fetchFn()

        await this.cacheManager.set(key, data)

        return data
    }
}