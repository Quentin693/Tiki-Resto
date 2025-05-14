import { ConfigService } from '@nestjs/config';
export declare class NotificationsService {
    private configService;
    private readonly logger;
    private twilioClient;
    constructor(configService: ConfigService);
    sendSMS(to: string, body: string): Promise<boolean>;
    sendReservationConfirmation(phone: string, name: string, date: string, time: string, guests: number): Promise<boolean>;
    sendReservationModification(phone: string, name: string, date: string, time: string, guests: number): Promise<boolean>;
    sendReservationCancellation(phone: string, name: string): Promise<boolean>;
    sendEventConfirmation(phone: string, name: string, date: string, time: string, guests: number): Promise<boolean>;
    sendEventModification(phone: string, name: string, date: string, time: string, guests: number): Promise<boolean>;
    sendEventCancellation(phone: string, name: string): Promise<boolean>;
    sendSeafoodOrderConfirmation(phone: string, name: string, orderDate: string, pickupDate: string): Promise<boolean>;
    sendEmail(to: string, templateId: string, templateParams: any): Promise<boolean>;
    sendSeafoodOrderNotificationToAdmin(orderDetails: any): Promise<boolean>;
    sendEventRequestNotificationToAdmin(eventDetails: any): Promise<boolean>;
    sendContactFormNotificationToAdmin(contactDetails: any): Promise<boolean>;
}
