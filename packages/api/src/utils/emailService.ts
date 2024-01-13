import nodemailer, { type SentMessageInfo } from "nodemailer";
import logger from "./logger";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
interface TransportOptions {
  service: string;
  host: string;
  tls: {
    rejectUnauthorized: boolean;
  };
  secure: boolean;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;
  private fromEmail: string;
  constructor(fromEmail?: string) {
    this.fromEmail = fromEmail ?? "";
  }

  async init() {
    const options: TransportOptions = {
      service: process.env.EMAIL_SERVICE ?? "",
      host: process.env.EMAIL_HOST ?? "",
      tls: {
        rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED === "true",
      },
      secure: process.env.EMAIL_SECURE === "true",
      port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 0,
      auth: {
        user: process.env.EMAIL_USER ?? "",
        pass: process.env.EMAIL_PASS ?? "",
      },
    };
    this.transporter = nodemailer.createTransport({
      ...options,
    });
    if (!this.fromEmail) {
      this.fromEmail = process.env.EMAIL_FROM ?? "";
    }
  }

  async updateFromEmail(fromEmail: string) {
    this.fromEmail = fromEmail;
  }

  async sendEmail(options: EmailOptions) {
    const { to, subject, text, html } = options;

    const mailOptions = {
      from: this.fromEmail,
      to,
      subject,
      text,
      html,
    };

    const info = await this.transporter.sendMail(mailOptions);

    logger.info(`Message sent: ${info.messageId}`);
    return info;
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info("Email Service is up and running 🚀🚀🚀");
    } catch (error) {
      logger.error("Email Service is down ☹️: ", error);
    }
  }
}
const emailService = new EmailService();
export default emailService;
