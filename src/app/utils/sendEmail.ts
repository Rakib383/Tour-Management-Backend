/* eslint-disable @typescript-eslint/no-explicit-any */

import nodeMailer from "nodemailer"
import { envVars } from "../../config/env"




const transporter = nodeMailer.createTransport({
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    host: envVars.EMAIL_SENDER.SMTP_HOST
})

interface SendEmailOptions {
    to: string,
    subject: string,
    template: string,
    templateData?: Record<string, any>,
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

const sendEmail = async ({
    to,
    subject,
    template,
    templateData,
    attachments
}: SendEmailOptions) => {

    const info = await transporter.sendMail({
        from:envVars.EMAIL_SENDER.SMTP_FROM,
        to,
        subject,
        html: template,
        attachments
    })
    
}