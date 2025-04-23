import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeafoodOrder, OrderStatus } from './entities/seafood-order.entity';
import { SeafoodOrderItem } from './entities/seafood-order-item.entity';
import { SeafoodPlateau } from './entities/seafood-plateau.entity';
import { CreateSeafoodOrderDto } from './dto/create-seafood-order.dto';
import { UpdateSeafoodOrderDto } from './dto/update-seafood-order.dto';

@Injectable()
export class SeafoodOrdersService {
  constructor(
    @InjectRepository(SeafoodOrder)
    private ordersRepository: Repository<SeafoodOrder>,
    @InjectRepository(SeafoodOrderItem)
    private orderItemsRepository: Repository<SeafoodOrderItem>,
    @InjectRepository(SeafoodPlateau)
    private plateauxRepository: Repository<SeafoodPlateau>,
  ) {}

  async create(createOrderDto: CreateSeafoodOrderDto): Promise<SeafoodOrder> {
    // Vérification de la date (minimum 48h à l'avance)
    const pickupDate = new Date(createOrderDto.pickupInfo.date);
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 2); // +48h
    
    if (pickupDate < minDate) {
      throw new BadRequestException("Les commandes doivent être passées au moins 48h à l'avance");
    }

    // Création de la commande
    const newOrder = new SeafoodOrder();
    newOrder.customerName = createOrderDto.customer.name;
    newOrder.customerPhone = createOrderDto.customer.phone;
    newOrder.customerEmail = createOrderDto.customer.email ?? null;
    newOrder.pickupDate = pickupDate;
    newOrder.pickupTime = createOrderDto.pickupInfo.time;
    newOrder.isPickup = createOrderDto.pickupInfo.isPickup;
    newOrder.specialRequests = createOrderDto.specialRequests ?? null;
    newOrder.totalPrice = createOrderDto.totalPrice;
    newOrder.status = OrderStatus.PENDING;

    // Sauvegarder la commande pour obtenir l'ID
    const savedOrder = await this.ordersRepository.save(newOrder);

    // Ajouter les plateaux
    if (createOrderDto.plateaux && createOrderDto.plateaux.length > 0) {
      for (const plateauDto of createOrderDto.plateaux) {
        const plateau = new SeafoodPlateau();
        plateau.plateauId = plateauDto.id;
        plateau.name = plateauDto.name;
        plateau.quantity = plateauDto.quantity;
        plateau.unitPrice = plateauDto.price;
        plateau.order = savedOrder;
        await this.plateauxRepository.save(plateau);
      }
    }

    // Ajouter les produits individuels
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      for (const itemDto of createOrderDto.items) {
        const item = new SeafoodOrderItem();
        item.productId = itemDto.id;
        item.name = itemDto.name;
        item.quantity = itemDto.quantity;
        item.unitPrice = itemDto.price;
        item.isHalfDozen = itemDto.half || false;
        item.order = savedOrder;
        await this.orderItemsRepository.save(item);
      }
    }

    // Retourner la commande complète avec ses relations
    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<SeafoodOrder[]> {
    return this.ordersRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: string): Promise<SeafoodOrder> {
    const order = await this.ordersRepository.findOne({ 
      where: { id },
      relations: ['items', 'plateaux']
    });

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateSeafoodOrderDto): Promise<SeafoodOrder> {
    const order = await this.findOne(id);

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    await this.ordersRepository.save(order);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  // Statistiques et rapports
  async getOrderStats(startDate: Date, endDate: Date) {
    const orders = await this.ordersRepository
      .createQueryBuilder('order')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    return {
      totalOrders: orders.length,
      revenue: orders.reduce((sum, order) => sum + Number(order.totalPrice), 0),
      byStatus: {
        pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
        confirmed: orders.filter(o => o.status === OrderStatus.CONFIRMED).length,
        processing: orders.filter(o => o.status === OrderStatus.PROCESSING).length,
        ready: orders.filter(o => o.status === OrderStatus.READY).length,
        completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
        cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
      }
    };
  }
} 