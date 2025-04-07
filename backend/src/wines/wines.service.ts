import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wine } from './entities/wine.entity';
import { CreateWineDto } from './dto/create-wine.dto';
import { UpdateWineDto } from './dto/update-wine.dto';

@Injectable()
export class WinesService {
  constructor(
    @InjectRepository(Wine)
    private wineRepository: Repository<Wine>,
  ) {}

  async create(createWineDto: CreateWineDto): Promise<Wine> {
    const wine = this.wineRepository.create(createWineDto);
    return await this.wineRepository.save(wine);
  }

  async findAll(): Promise<{ [key: string]: Wine[] }> {
    const wines = await this.wineRepository.find();
    
    // Group wines by category
    return wines.reduce((acc, wine) => {
      if (!acc[wine.category]) {
        acc[wine.category] = [];
      }
      
      // Format to match frontend structure
      acc[wine.category].push({
        ...wine,
        price: {
          bottle: wine.bottlePrice,
          glass: wine.glassPrice
        }
      });
      
      return acc;
    }, {});
  }

  async findOne(id: number): Promise<Wine> {
    const wine = await this.wineRepository.findOneBy({ id });
    if (!wine) {
      throw new NotFoundException(`Wine with ID ${id} not found`);
    }
    return wine;
  }

  async update(id: number, updateWineDto: UpdateWineDto): Promise<Wine> {
    const wine = await this.findOne(id);
    Object.assign(wine, updateWineDto);
    return await this.wineRepository.save(wine);
  }

  async remove(id: number): Promise<void> {
    const result = await this.wineRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Wine with ID ${id} not found`);
    }
  }
} 