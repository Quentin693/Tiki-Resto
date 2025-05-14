"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const reservations_module_1 = require("./reservations/reservations.module");
const carte_module_1 = require("./carte/carte.module");
const auth_module_1 = require("./auth/auth.module");
const uploads_module_1 = require("./uploads/uploads.module");
const menus_module_1 = require("./menus/menus.module");
const wines_module_1 = require("./wines/wines.module");
const users_module_1 = require("./users/users.module");
const events_module_1 = require("./events/events.module");
const gallery_module_1 = require("./gallery/gallery.module");
const personnel_module_1 = require("./personnel/personnel.module");
const seafood_orders_module_1 = require("./seafood-orders/seafood-orders.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'your_password'),
                    database: configService.get('DB_NAME', 'tiki_resto'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                }),
            }),
            auth_module_1.AuthModule,
            reservations_module_1.ReservationsModule,
            carte_module_1.CarteModule,
            uploads_module_1.UploadsModule,
            menus_module_1.MenusModule,
            wines_module_1.WinesModule,
            users_module_1.UsersModule,
            events_module_1.EventsModule,
            gallery_module_1.GalleryModule,
            personnel_module_1.PersonnelModule,
            seafood_orders_module_1.SeafoodOrdersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map