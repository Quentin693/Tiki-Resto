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
} 