import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TokenService {

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) { }

    // generate tokens
    async generateTokens(userId: string, email: string) {

        // create payload
        const payload = { sub: userId, email: email }

        // generate accesstoken and refreshtoken
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>("JWT_SECRET"),
                expiresIn: this.configService.getOrThrow<string>("TIME_LIFE_ACCESS_TOKEN")
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>("JWT_SECRET"),
                expiresIn: this.configService.getOrThrow<string>("TIME_LIFE_REFRESH_TOKEN")
            })
        ])

        return { accessToken, refreshToken }

    }

    // store tokens 
    async storeTokens(userId: string, hashRefreshToken: string) {

        const session = await this.prismaService.session.upsert({
            where: { userId: userId },
            update: {
                hashingRefreshToken: hashRefreshToken
            },
            create: {
                hashingRefreshToken: hashRefreshToken,
                userId: userId
            }
        })
        return session
    }


}