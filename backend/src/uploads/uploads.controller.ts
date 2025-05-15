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
  uploadPdf(@UploadedFile() file, @Res() res) {
    if (!file) {
      return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé' });
    }
    
    try {
      console.log('Fichier PDF téléchargé:', file);
      
      // Vérifier que le dossier existe
      const pdfDir = path.join(process.cwd(), 'uploads/pdfs');
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
        console.log(`Dossier créé: ${pdfDir}`);
      }
      
      // Vérifier que le fichier a bien été créé
      const pdfPath = path.join(pdfDir, file.filename);
      if (!fs.existsSync(pdfPath)) {
        console.error(`Le fichier n'a pas été correctement créé: ${pdfPath}`);
        return res.status(500).json({ message: 'Erreur lors de la création du fichier' });
      }
      
      // Créer l'URL relative
      const relativeFileUrl = `/uploads/pdfs/${file.filename}`;
      
      // Créer l'URL complète
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
      const fullFileUrl = `${baseUrl}${relativeFileUrl}`;
      
      console.log(`URL du PDF: ${fullFileUrl}`);
      
      // Retourner les deux URLs (relative et complète)
      return res.status(201).json({ 
        fileUrl: relativeFileUrl,
        fullFileUrl: fullFileUrl
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      return res.status(500).json({ 
        message: 'Erreur lors du téléchargement du PDF',
        error: error.message
      });
    }
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
    console.log(`Tentative d'accès au PDF: ${filename}`);
    
    // Utiliser un chemin absolu
    const pdfPath = path.join(process.cwd(), 'uploads/pdfs', filename);
    console.log(`Chemin complet du PDF: ${pdfPath}`);
    
    try {
      // Vérifier si le fichier existe
      if (!fs.existsSync(pdfPath)) {
        console.error(`PDF non trouvé: ${pdfPath}`);
        return res.status(404).json({ message: 'PDF non trouvé' });
      }
      
      // Vérifier les permissions du fichier
      const stats = fs.statSync(pdfPath);
      console.log(`Permissions du fichier: ${stats.mode.toString(8)}`);
      
      // Vérifier la taille du fichier
      console.log(`Taille du fichier: ${stats.size} octets`);
      
      // Définir les en-têtes pour PDF
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      });
      
      console.log('Envoi du fichier PDF...');
      // Retourner le PDF
      return res.sendFile(pdfPath);
    } catch (error) {
      console.error(`Erreur lors de l'accès au PDF: ${error.message}`);
      console.error(error.stack);
      return res.status(500).json({ 
        message: 'Erreur lors de l\'accès au PDF', 
        error: error.message,
        path: pdfPath
      });
    }
  }
} 