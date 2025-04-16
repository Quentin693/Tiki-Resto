import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WinesService } from './wines.service';
import { CreateWineDto } from './dto/create-wine.dto';
import { UpdateWineDto } from './dto/update-wine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('wines')
export class WinesController {
  constructor(private readonly winesService: WinesService) {}

  @Post()
  create(@Body() createWineDto: CreateWineDto) {
    return this.winesService.create(createWineDto);
  }

  @Get()
  findAll() {
    return this.winesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.winesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWineDto: UpdateWineDto) {
    return this.winesService.update(+id, updateWineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.winesService.remove(+id);
  }
} 