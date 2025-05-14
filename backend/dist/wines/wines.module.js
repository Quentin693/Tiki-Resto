"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const wines_service_1 = require("./wines.service");
const wines_controller_1 = require("./wines.controller");
const wine_entity_1 = require("./entities/wine.entity");
let WinesModule = class WinesModule {
};
exports.WinesModule = WinesModule;
exports.WinesModule = WinesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([wine_entity_1.Wine])],
        controllers: [wines_controller_1.WinesController],
        providers: [wines_service_1.WinesService],
    })
], WinesModule);
//# sourceMappingURL=wines.module.js.map