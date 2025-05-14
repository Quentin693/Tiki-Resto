import { Response } from 'express';
export declare class UploadsController {
    uploadImage(file: any): {
        imagePath: string;
    };
    getImage(filename: any, res: Response): void | Response<any, Record<string, any>>;
}
