"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsEventColumn1714094401024 = void 0;
class AddIsEventColumn1714094401024 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE reservations ADD COLUMN "isEvent" boolean DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE reservations DROP COLUMN "isEvent"`);
    }
}
exports.AddIsEventColumn1714094401024 = AddIsEventColumn1714094401024;
//# sourceMappingURL=1714094401024-add-is-event-column.js.map