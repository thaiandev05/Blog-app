import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Request } from 'express'
import { Post } from "prisma/generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

const TIME_LIFE_CACHE = 10 * 24 * 60 * 60

@Injectable()
export class PostService {

    constructor(
        private readonly prismaService: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    // create post
    async createPost(req: Request, content: string, files: Array<Express.Multer.File>) {

        // filter file name
        const urlFiles = files.map(file => file.filename)

        // find available user
        const exitingUser = await this.prismaService.user.findUnique({
            where: { id: req.user?.id }
        })

        if (!exitingUser) {
            throw new NotFoundException("User not found")
        }

        // create post
        const newPost = await this.prismaService.post.create({
            data: {
                content: content,
                urlImgs: urlFiles,
                userId: exitingUser.id
            }
        })

        // cache post
        const key = `post:${newPost.id}`
        await this.cacheManager.set(key, newPost, TIME_LIFE_CACHE)

        return newPost
    }

    // edit post
    async editPost(req: Request, files: Array<Express.Multer.File>, newContent: string, idPost: string) {

        // find post
        const key = `post:${idPost}`
        const exitingPost = await this.cacheManager.get(key) as Post

        console.log(exitingPost)

        if (!exitingPost) {
            throw new NotFoundException("Post not found")
        }

        // check author post
        if (req.user?.id !== exitingPost.userId) {
            throw new UnauthorizedException("You are not author post")
        }

        let urlFiles: string[] = exitingPost.urlImgs || [];

        if (Array.isArray(files) && files.length > 0) {
            const newFileNames = files.map(file => file.filename);
            urlFiles = urlFiles.concat(newFileNames);
        }


        const data = {
            urlImgs: urlFiles,
            content: newContent
        }

        // update post
        const newPost = await this.prismaService.post.update({
            where: { id: exitingPost.id },
            data
        })

        // change cache
        await this.cacheManager.del(key)

        await this.cacheManager.set(key, newPost, TIME_LIFE_CACHE)

        return newPost
    }

    // delete post
    async deletePost(postId: string, req: Request) {
        // check avaialbe user
        const exitingUser = await this.prismaService.user.findUnique({
            where: { id: req.user?.id }
        })

        if (!exitingUser) {
            throw new NotFoundException("user not found")
        }

        // available post
        const key = `post:${postId}`
        const exitingPost = await this.cacheManager.get(key) as Post

        if (!exitingPost) {
            throw new NotFoundException("Post is not found")
        }

        if (exitingPost.userId !== exitingUser.id) {
            throw new UnauthorizedException("User is not author post")
        }

        // delete post
        await this.prismaService.post.delete({
            where: { id: exitingPost.id }
        })

        // delete cache post
        await this.cacheManager.del(key)

        return {
            message: "Done"
        }
    }

    // get detail post
    async getDetailPost(req: Request, postId: string) {
        const key = `postId:${postId}`

        // check cache
        let availablePost = await this.cacheManager.get(key)

        if(availablePost) {
            return availablePost
        }

        availablePost = await this.prismaService.post.findFirst({
            where: { userId: req.user?.id }
        })

        // cache
        await this.cacheManager.set(key,availablePost,TIME_LIFE_CACHE)

        return availablePost
    }
}