import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import * as nodemailer from 'nodemailer';
import { join } from "path";
import { from } from "rxjs";
@Injectable()
export class EmailService {

    private transporter: nodemailer.Transporter

    constructor(configService: ConfigService) {
        // create transport
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: configService.getOrThrow<string>("EMAIL_USER"),
                pass: configService.getOrThrow<string>("EMAIL_PASS")
            }
        })
    }

    // get template
    async getTemplate(templateName: string) {
        // get file path
        const source = join(__dirname, 'templates', `${templateName}.html`)

        // check file
        if (!existsSync(source)) {
            throw new Error(`Template ${templateName} not found`)
        }

        // reading file
        return await readFile(source, 'utf-8')

    }

    // send notification register
    async sendNotificationRegister(toEmail: string, verifyLink: string) {
        // get template 

        const deleteLink = 'http://localhost:4000/auth/delete-email?email=' + toEmail

        const template = await this.getTemplate('notification-register')
        const subject = "Verify Account"
        const html = (await template)
            .replace("{verify_link}", verifyLink)
            .replace("{delete_link}", deleteLink)


        const mailOptions = {
            from: `"Thaiandev Service" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject,
            html
        }

        // send email
        return await this.transporter.sendMail(mailOptions)
    }

    // send email notification changepassword
    async sendNotificationChangePassword(toEmail: string) {
        // get template 
        const template = await this.getTemplate("notification-changepassword")

        const subject = "Notification"

        const html = await template

        const mailOptions = {
            from: `"Thaiandev Service" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject,
            html
        }

        // send email
        return await this.transporter.sendMail(mailOptions)
    }
}