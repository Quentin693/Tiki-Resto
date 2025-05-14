export declare class SendSmsDto {
    phone: string;
    message: string;
}
export declare class SendEmailDto {
    email: string;
    templateId: string;
    templateParams: Record<string, any>;
}
export declare class ContactFormDto {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}
