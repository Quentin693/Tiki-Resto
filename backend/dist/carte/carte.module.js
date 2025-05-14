"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const carte_service_1 = require("./carte.service");
const carte_controller_1 = require("./carte.controller");
const carte_item_entity_1 = require("./entities/carte-item.entity");
let CarteModule = class CarteModule {
};
exports.CarteModule = CarteModule;
exports.CarteModule = CarteModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([carte_item_entity_1.CarteItem])],
        controllers: [carte_controller_1.CarteController],
        providers: [carte_service_1.CarteService],
        exports: [carte_service_1.CarteService],
    })
], CarteModule);
//# sourceMappingURL=carte.module.js.map