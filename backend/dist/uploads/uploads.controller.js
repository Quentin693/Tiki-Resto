"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const fs = require("fs");
const path = require("path");
let UploadsController = class UploadsController {
    uploadImage(file) {
        if (!file) {
            throw new Error('Aucun fichier n\'a été téléchargé');
        }
        const imagePath = `/uploads/images/${file.filename}`;
        return { imagePath };
    }
    uploadPdf(file, res) {
        if (!file) {
            return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé' });
        }
        try {
            console.log('Fichier PDF téléchargé:', file);
            const pdfDir = path.join(process.cwd(), 'uploads/pdfs');
            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true });
                console.log(`Dossier créé: ${pdfDir}`);
            }
            const pdfPath = path.join(pdfDir, file.filename);
            if (!fs.existsSync(pdfPath)) {
                console.error(`Le fichier n'a pas été correctement créé: ${pdfPath}`);
                return res.status(500).json({ message: 'Erreur lors de la création du fichier' });
            }
            const relativeFileUrl = `/uploads/pdfs/${file.filename}`;
            const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
            const fullFileUrl = `${baseUrl}${relativeFileUrl}`;
            console.log(`URL du PDF: ${fullFileUrl}`);
            return res.status(201).json({
                fileUrl: relativeFileUrl,
                fullFileUrl: fullFileUrl
            });
        }
        catch (error) {
            console.error('Erreur lors du téléchargement du PDF:', error);
            return res.status(500).json({
                message: 'Erreur lors du téléchargement du PDF',
                error: error.message
            });
        }
    }
    getImage(filename, res) {
        const imagePath = path.join(process.cwd(), 'uploads/images', filename);
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Image non trouvée' });
        }
        return res.sendFile(imagePath);
    }
    getPdf(filename, res) {
        console.log(`Tentative d'accès au PDF: ${filename}`);
        const pdfPath = path.join(process.cwd(), 'uploads/pdfs', filename);
        console.log(`Chemin complet du PDF: ${pdfPath}`);
        try {
            if (!fs.existsSync(pdfPath)) {
                console.error(`PDF non trouvé: ${pdfPath}`);
                return res.status(404).json({ message: 'PDF non trouvé' });
            }
            const stats = fs.statSync(pdfPath);
            console.log(`Permissions du fichier: ${stats.mode.toString(8)}`);
            console.log(`Taille du fichier: ${stats.size} octets`);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${filename}"`,
            });
            console.log('Envoi du fichier PDF...');
            return res.sendFile(pdfPath);
        }
        catch (error) {
            console.error(`Erreur lors de l'accès au PDF: ${error.message}`);
            console.error(error.stack);
            return res.status(500).json({
                message: 'Erreur lors de l\'accès au PDF',
                error: error.message,
                path: pdfPath
            });
        }
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('image'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/images',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Seuls les fichiers image sont autorisés!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('pdf'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/pdfs',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(pdf)$/)) {
                return cb(new Error('Seuls les fichiers PDF sont autorisés!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "uploadPdf", null);
__decorate([
    (0, common_1.Get)('images/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "getImage", null);
__decorate([
    (0, common_1.Get)('pdfs/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "getPdf", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)('uploads'),
    (0, common_1.Controller)('uploads')
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map