import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarteService } from './carte.service';
import { CarteController } from './carte.controller';
import { CarteItem } from './entities/carte-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarteItem])],
  controllers: [CarteController],
  providers: [CarteService],
  exports: [CarteService],
})
export class CarteModule {}
