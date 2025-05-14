"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePersonnelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_personnel_dto_1 = require("./create-personnel.dto");
class UpdatePersonnelDto extends (0, swagger_1.PartialType)(create_personnel_dto_1.CreatePersonnelDto) {
}
exports.UpdatePersonnelDto = UpdatePersonnelDto;
//# sourceMappingURL=update-personnel.dto.js.map