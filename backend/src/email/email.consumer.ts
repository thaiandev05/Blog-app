import { Controller, Logger } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller()
export class EmailConumer {
    private readonly logger = new Logger(EmailConumer.name)

    constructor(
        private readonly emailService: EmailService
    ) { }

    @EventPattern('email_send_register')
    async handleSendRegister(@Payload() data: { to: string; verifyLink: string }) {
        await this.emailService.sendNotificationRegister(data.to, data.verifyLink)
    }

    @EventPattern('email_send_change_password')
    async handleChangePassword(@Payload() data: { to: string }) {
        await this.emailService.sendNotificationChangePassword(data.to);
    }
}