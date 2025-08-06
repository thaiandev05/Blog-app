import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from 'express';
import { PrismaService } from "src/prisma/prisma.service";
import { EditDetailDto } from "./dto/EditDetailDto";

const TIME_LIFE_CACHE = 10 * 24 * 60 * 60

@Injectable()
export class UserService {

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly prismaService: PrismaService
    ) { }

    // pipe data
    private parseDateString(dateStr: string): Date | null {
        // Kiểm tra định dạng yyyy/MM/dd
        const match = dateStr.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
        if (!match) return null;
        const [_, year, month, day] = match;

        const date = new Date(Number(year), Number(month) - 1, Number(day));

        if (isNaN(date.getTime())) return null;

        return date
    }

    // edit information
    async editDetailUser(req: Request, data: EditDetailDto) {

        const userId = req.user?.id

        // check available user 
        const exitingUser = await this.prismaService.user.findUnique({
            where: { id: userId }
        })

        if(!exitingUser) {
            throw new NotFoundException("user not found")
        }

        let date

        if(data.dateOfBirth != undefined || null) {
            date = this.parseDateString(data.dateOfBirth)
        }

        // update
        const newUser = await this.prismaService.user.update({
            where: { id: exitingUser.id },
            data: {
                dateOfBirth: date,
                name: data.name
            }
        })

        // cache user
        const key = `account:${userId}`
        await this.cacheManager.set(key,newUser,TIME_LIFE_CACHE)

        return newUser
    }

    // change avate
    async changeAvt(req: Request, file: Express.Multer.File) {
        // find available user
        const exitingUser = await this.prismaService.user.findUnique({
            where: { id: req.user?.id }
        })

        if(!exitingUser) {
            throw new NotFoundException("User not found")
        }

        // get file path
        const fileUrls = file.filename

        if(!fileUrls) {
            throw new BadRequestException("File path is not empty")
        }

        // update avt user
        const newUser = await this.prismaService.user.update({
            where: { id: exitingUser.id },
            data: { avtUrl: fileUrls }
        })

        return newUser
    }
}