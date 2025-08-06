import { Body, Controller, Delete, Get, Patch, Post, Query, Req, Res, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { Request, Response } from 'express'
import { Public } from "src/common/decorator/public.decorator";
import { Cookies } from "src/common/decorator/cookie.decorator";
import { ChangePasswordDto } from "./dto/changePassword.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Get('verify-account')
    async verifyAccount(@Query('email') email: string) {
        return this.authService.verifyAccount(email)
    }

    @Delete('delete-account')
    async deleteAccount(@Query('email') email: string) {
        return this.authService.deleteAccountByEmail(email)
    }

    @Public()
    @Post('register')
    async register(@Body() data: RegisterDto) {
        return this.authService.register(data)
    }

    @Public()
    @Post('login')
    async login(@Body() data: RegisterDto, @Res() res: Response) {
        const result = await this.authService.login(data, res)
        return res.json(result)
    }

    @Post("logout")
    async logout(@Res({ passthrough: true }) res: Response, @Cookies("sesison_id") sessionId?: string) {
        return this.authService.logout(res, sessionId)
    }

    @Post("change-password")
    async changePassword(@Req() req: Request, @Body() data: ChangePasswordDto) {
        return this.authService.changePassword(req, data)
    }
}