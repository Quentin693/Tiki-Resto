"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeafoodOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const seafood_orders_controller_1 = require("./seafood-orders.controller");
const seafood_orders_service_1 = require("./seafood-orders.service");
const seafood_order_entity_1 = require("./entities/seafood-order.entity");
const seafood_order_item_entity_1 = require("./entities/seafood-order-item.entity");
const seafood_plateau_entity_1 = require("./entities/seafood-plateau.entity");
let SeafoodOrdersModule = class SeafoodOrdersModule {
};
exports.SeafoodOrdersModule = SeafoodOrdersModule;
exports.SeafoodOrdersModule = SeafoodOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                seafood_order_entity_1.SeafoodOrder,
                seafood_order_item_entity_1.SeafoodOrderItem,
                seafood_plateau_entity_1.SeafoodPlateau
            ]),
        ],
        controllers: [seafood_orders_controller_1.SeafoodOrdersController],
        providers: [seafood_orders_service_1.SeafoodOrdersService],
        exports: [seafood_orders_service_1.SeafoodOrdersService],
    })
], SeafoodOrdersModule);
//# sourceMappingURL=seafood-orders.module.js.map