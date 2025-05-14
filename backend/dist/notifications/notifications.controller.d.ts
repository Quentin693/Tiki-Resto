import { NotificationsService } from './notifications.service';
import { SendSmsDto, SendEmailDto, ContactFormDto } from './dto/notifications.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    testSMS(sendSmsDto: SendSmsDto): Promise<{
        success: boolean;
    }>;
    testEmail(sendEmailDto: SendEmailDto): Promise<{
        success: boolean;
    }>;
    contactForm(contactFormDto: ContactFormDto): Promise<{
        success: boolean;
    }>;
}
