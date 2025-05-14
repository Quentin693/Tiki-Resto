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
exports.SeafoodOrderItem = void 0;
const typeorm_1 = require("typeorm");
const seafood_order_entity_1 = require("./seafood-order.entity");
let SeafoodOrderItem = class SeafoodOrderItem {
    id;
    productId;
    name;
    quantity;
    unitPrice;
    isHalfDozen;
    order;
};
exports.SeafoodOrderItem = SeafoodOrderItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SeafoodOrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SeafoodOrderItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SeafoodOrderItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SeafoodOrderItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SeafoodOrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SeafoodOrderItem.prototype, "isHalfDozen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seafood_order_entity_1.SeafoodOrder, order => order.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", seafood_order_entity_1.SeafoodOrder)
], SeafoodOrderItem.prototype, "order", void 0);
exports.SeafoodOrderItem = SeafoodOrderItem = __decorate([
    (0, typeorm_1.Entity)('seafood_order_items')
], SeafoodOrderItem);
//# sourceMappingURL=seafood-order-item.entity.js.map