import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          // Générer un nom de fichier unique
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Seuls les fichiers image sont autorisés!'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file) {
    if (!file) {
      throw new Error('Aucun fichier n\'a été téléchargé');
    }
    
    // Retourner le chemin complet de l'image
    const imagePath = `/uploads/images/${file.filename}`;
    return { imagePath };
  }

  @Post('pdf')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/pdfs',
        filename: (req, file, cb) => {
          // Générer un nom de fichier unique
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(new Error('Seuls les fichiers PDF sont autorisés!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
      },
    }),
  )
  uploadPdf(@UploadedFile() file) {
    if (!file) {
      throw new Error('Aucun fichier n\'a été téléchargé');
    }
    
    // Retourner le chemin complet du PDF
    const fileUrl = `/uploads/pdfs/${file.filename}`;
    return { fileUrl };
  }

  @Get('images/:filename')
  getImage(@Param('filename') filename, @Res() res: Response) {
    const imagePath = path.join(process.cwd(), 'uploads/images', filename);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }
    
    // Retourner l'image
    return res.sendFile(imagePath);
  }

  @Get('pdfs/:filename')
  getPdf(@Param('filename') filename, @Res() res: Response) {
    const pdfPath = path.join(process.cwd(), 'uploads/pdfs', filename);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: 'PDF non trouvé' });
    }
    
    // Définir les en-têtes pour PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    });
    
    // Retourner le PDF
    return res.sendFile(pdfPath);
  }
} 