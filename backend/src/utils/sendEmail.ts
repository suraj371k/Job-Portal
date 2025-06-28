import nodemailer from 'nodemailer'
import process from 'process'

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({to , subject , html}: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Job Portal" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    }
    await transporter.sendMail(mailOptions)
}