import { Response } from 'express';
export declare class UploadsController {
    uploadImage(file: any): {
        imagePath: string;
    };
    uploadPdf(file: any): {
        fileUrl: string;
    };
    getImage(filename: any, res: Response): void | Response<any, Record<string, any>>;
    getPdf(filename: any, res: Response): void | Response<any, Record<string, any>>;
}
