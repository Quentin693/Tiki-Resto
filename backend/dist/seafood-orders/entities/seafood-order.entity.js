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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeafoodOrder = exports.OrderStatus = void 0;
const typeorm_1 = require("typeorm");
const seafood_order_item_entity_1 = require("./seafood-order-item.entity");
const seafood_plateau_entity_1 = require("./seafood-plateau.entity");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["CONFIRMED"] = "confirmed";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["READY"] = "ready";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
let SeafoodOrder = class SeafoodOrder {
    id;
    customerName;
    customerPhone;
    customerEmail;
    userId;
    pickupDate;
    pickupTime;
    isPickup;
    items;
    plateaux;
    totalPrice;
    specialRequests;
    status;
    createdAt;
    updatedAt;
};
exports.SeafoodOrder = SeafoodOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SeafoodOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SeafoodOrder.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SeafoodOrder.prototype, "customerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", Object)
], SeafoodOrder.prototype, "customerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], SeafoodOrder.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], SeafoodOrder.prototype, "pickupDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SeafoodOrder.prototype, "pickupTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SeafoodOrder.prototype, "isPickup", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seafood_order_item_entity_1.SeafoodOrderItem, item => item.order, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], SeafoodOrder.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seafood_plateau_entity_1.SeafoodPlateau, plateau => plateau.order, { cascade: true, eager: true }),
    __metadata("design:type", Array)
], SeafoodOrder.prototype, "plateaux", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SeafoodOrder.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SeafoodOrder.prototype, "specialRequests", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    }),
    __metadata("design:type", String)
], SeafoodOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SeafoodOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SeafoodOrder.prototype, "updatedAt", void 0);
exports.SeafoodOrder = SeafoodOrder = __decorate([
    (0, typeorm_1.Entity)('seafood_orders')
], SeafoodOrder);
//# sourceMappingURL=seafood-order.entity.js.map