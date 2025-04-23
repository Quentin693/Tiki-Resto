import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeafoodOrdersController } from './seafood-orders.controller';
import { SeafoodOrdersService } from './seafood-orders.service';
import { SeafoodOrder } from './entities/seafood-order.entity';
import { SeafoodOrderItem } from './entities/seafood-order-item.entity';
import { SeafoodPlateau } from './entities/seafood-plateau.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SeafoodOrder,
      SeafoodOrderItem,
      SeafoodPlateau
    ]),
  ],
  controllers: [SeafoodOrdersController],
  providers: [SeafoodOrdersService],
  exports: [SeafoodOrdersService],
})
export class SeafoodOrdersModule {} 