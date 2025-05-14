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
exports.SeafoodOrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const seafood_order_entity_1 = require("./entities/seafood-order.entity");
const seafood_order_item_entity_1 = require("./entities/seafood-order-item.entity");
const seafood_plateau_entity_1 = require("./entities/seafood-plateau.entity");
let SeafoodOrdersService = class SeafoodOrdersService {
    ordersRepository;
    orderItemsRepository;
    plateauxRepository;
    constructor(ordersRepository, orderItemsRepository, plateauxRepository) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.plateauxRepository = plateauxRepository;
    }
    async create(createOrderDto) {
        const pickupDate = new Date(createOrderDto.pickupInfo.date);
        const today = new Date();
        const minDate = new Date();
        minDate.setDate(today.getDate() + 2);
        if (pickupDate < minDate) {
            throw new common_1.BadRequestException("Les commandes doivent être passées au moins 48h à l'avance");
        }
        const newOrder = new seafood_order_entity_1.SeafoodOrder();
        newOrder.customerName = createOrderDto.customer.name;
        newOrder.customerPhone = createOrderDto.customer.phone;
        newOrder.customerEmail = createOrderDto.customer.email ?? null;
        newOrder.pickupDate = pickupDate;
        newOrder.pickupTime = createOrderDto.pickupInfo.time;
        newOrder.isPickup = createOrderDto.pickupInfo.isPickup;
        newOrder.specialRequests = createOrderDto.specialRequests ?? null;
        newOrder.totalPrice = createOrderDto.totalPrice;
        newOrder.status = seafood_order_entity_1.OrderStatus.PENDING;
        if (createOrderDto.userId) {
            newOrder.userId = createOrderDto.userId;
        }
        const savedOrder = await this.ordersRepository.save(newOrder);
        if (createOrderDto.plateaux && createOrderDto.plateaux.length > 0) {
            for (const plateauDto of createOrderDto.plateaux) {
                const plateau = new seafood_plateau_entity_1.SeafoodPlateau();
                plateau.plateauId = plateauDto.id;
                plateau.name = plateauDto.name;
                plateau.quantity = plateauDto.quantity;
                plateau.unitPrice = plateauDto.price;
                plateau.order = savedOrder;
                await this.plateauxRepository.save(plateau);
            }
        }
        if (createOrderDto.items && createOrderDto.items.length > 0) {
            for (const itemDto of createOrderDto.items) {
                const item = new seafood_order_item_entity_1.SeafoodOrderItem();
                item.productId = itemDto.id;
                item.name = itemDto.name;
                item.quantity = itemDto.quantity;
                item.unitPrice = itemDto.price;
                item.isHalfDozen = itemDto.half || false;
                item.order = savedOrder;
                await this.orderItemsRepository.save(item);
            }
        }
        return this.findOne(savedOrder.id);
    }
    async findAll() {
        return this.ordersRepository.find({
            order: {
                createdAt: 'DESC'
            }
        });
    }
    async findByUser(userId) {
        return this.ordersRepository.find({
            where: { userId },
            relations: ['items', 'plateaux'],
            order: {
                createdAt: 'DESC'
            }
        });
    }
    async search(email, phone) {
        if (!email && !phone) {
            return [];
        }
        const query = this.ordersRepository.createQueryBuilder('order');
        if (email) {
            query.orWhere('order.customerEmail = :email', { email });
        }
        if (phone) {
            query.orWhere('order.customerPhone = :phone', { phone });
        }
        return query
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('order.plateaux', 'plateaux')
            .orderBy('order.createdAt', 'DESC')
            .getMany();
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['items', 'plateaux']
        });
        if (!order) {
            throw new common_1.NotFoundException(`Commande avec l'ID ${id} non trouvée`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.findOne(id);
        if (updateOrderDto.status) {
            order.status = updateOrderDto.status;
        }
        if (updateOrderDto.pickupDate) {
            order.pickupDate = new Date(updateOrderDto.pickupDate);
        }
        if (updateOrderDto.pickupTime) {
            order.pickupTime = updateOrderDto.pickupTime;
        }
        if (updateOrderDto.isPickup !== undefined) {
            order.isPickup = updateOrderDto.isPickup;
        }
        if (updateOrderDto.specialRequests !== undefined) {
            order.specialRequests = updateOrderDto.specialRequests;
        }
        await this.ordersRepository.save(order);
        return this.findOne(id);
    }
    async remove(id) {
        const order = await this.findOne(id);
        await this.ordersRepository.remove(order);
    }
    async getOrderStats(startDate, endDate) {
        const orders = await this.ordersRepository
            .createQueryBuilder('order')
            .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getMany();
        return {
            totalOrders: orders.length,
            revenue: orders.reduce((sum, order) => sum + Number(order.totalPrice), 0),
            byStatus: {
                pending: orders.filter(o => o.status === seafood_order_entity_1.OrderStatus.PENDING).length,
                confirmed: orders.filter(o => o.status === seafood_order_entity_1.OrderStatus.CONFIRMED).length,
                processing: orders.filter(o => o.status === seafood_order_entity_1.OrderStatus.PROCESSING).length,
                ready: orders.filter(o => o.status === seafood_order_entity_1.OrderStatus.READY).length,
                completed: orders.filter(o => o.status === seafood_order_entity_1.OrderStatus.COMPLETED).length,
                cancelled: orders.filter(o => o.status === seafood_order_entity_1.OrderStatus.CANCELLED).length,
            }
        };
    }
};
exports.SeafoodOrdersService = SeafoodOrdersService;
exports.SeafoodOrdersService = SeafoodOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(seafood_order_entity_1.SeafoodOrder)),
    __param(1, (0, typeorm_1.InjectRepository)(seafood_order_item_entity_1.SeafoodOrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(seafood_plateau_entity_1.SeafoodPlateau)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeafoodOrdersService);
//# sourceMappingURL=seafood-orders.service.js.map