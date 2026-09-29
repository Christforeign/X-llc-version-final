import { db } from './db';
import { EmailNotificationLog } from '../models/types';

export class EmailService {
  public dispatch(params: {
    to: string;
    subject: string;
    template: EmailNotificationLog['template'];
    previewSnippet: string;
    fullHtml: string;
  }): EmailNotificationLog {
    const config = db.getSiteConfig().systemEmailConfig;

    // Simulate standard Vercel API / SMTP / Resend transport dispatch
    console.info(`[Email Dispatcher via ${config.provider}] To: ${params.to} | Subject: ${params.subject}`);

    const log = db.logEmailDispatch({
      to: params.to,
      subject: params.subject,
      template: params.template,
      previewSnippet: params.previewSnippet,
      fullHtml: params.fullHtml,
      status: config.apiKeySet ? 'dispatched' : 'simulated',
    });

    return log;
  }
}

export const emailService = new EmailService();
