import { type Transporter, createTransport } from 'nodemailer';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { verificationEmailTemplate } from './templates/verification';
import { passwordResetEmailTemplate } from './templates/password-reset';
import { verifiedEmailTemplate } from './templates/verified';
import { passwordResetSuccessEmailTemplate } from './templates/password-reset-success';

export class EmailService {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor() {
    this.from = env.SMTP_FROM;
    this.transporter = createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: Number(env.SMTP_PORT) === 465,
      service: env.SMTP_SERVICE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  async verifyConnection() {
    await this.transporter.verify();
    logger.info('SMTP connected');
  }

  private async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
      const result = (await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      })) as unknown;
      return result;
    } catch (error) {
      logger.error({ err: error, to, subject }, 'Failed to send email');

      throw error;
    }
  }

  async sendVerificationEmail(email: string, username: string, otp: string) {
    return this.sendEmail({
      to: email,
      subject: 'Verify your PlotHub account',
      html: verificationEmailTemplate({
        username,
        otp,
      }),
    });
  }
  async sendVerifiedEmail(email: string, username: string) {
    return this.sendEmail({
      to: email,
      subject: 'Verify your PlotHub account',
      html: verifiedEmailTemplate({
        username,
      }),
    });
  }

  async sendPasswordResetEmail(email: string, username: string, otp: string) {
    return this.sendEmail({
      to: email,
      subject: 'Reset your PlotHub password',
      html: passwordResetEmailTemplate({
        username,
        otp,
      }),
    });
  }

  async sendPasswordResetSuccessEmail(email: string, username: string) {
    return this.sendEmail({
      to: email,
      subject: 'Reset your PlotHub password',
      html: passwordResetSuccessEmailTemplate({
        username,
      }),
    });
  }
}
