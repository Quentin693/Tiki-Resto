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
exports.TimeSlotsResponseDto = exports.TimeSlotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TimeSlotDto {
    time;
    available;
    remainingCapacity;
}
exports.TimeSlotDto = TimeSlotDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12:00', description: 'Heure du créneau' }),
    __metadata("design:type", String)
], TimeSlotDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Indique si le créneau est disponible' }),
    __metadata("design:type", Boolean)
], TimeSlotDto.prototype, "available", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'Nombre de places restantes' }),
    __metadata("design:type", Number)
], TimeSlotDto.prototype, "remainingCapacity", void 0);
class TimeSlotsResponseDto {
    lunch;
    dinner;
}
exports.TimeSlotsResponseDto = TimeSlotsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TimeSlotDto], description: 'Créneaux disponibles pour le déjeuner' }),
    __metadata("design:type", Array)
], TimeSlotsResponseDto.prototype, "lunch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [TimeSlotDto], description: 'Créneaux disponibles pour le dîner' }),
    __metadata("design:type", Array)
], TimeSlotsResponseDto.prototype, "dinner", void 0);
//# sourceMappingURL=time-slot.dto.js.map