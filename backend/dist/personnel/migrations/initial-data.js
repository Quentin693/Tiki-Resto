"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialPersonnelData1641313444444 = void 0;
class InitialPersonnelData1641313444444 {
    async up(queryRunner) {
        await queryRunner.query(`
      INSERT INTO personnel (id, "firstName", "lastName", role, service, description, speciality, experience, schedule, "imagePath", "createdAt", "updatedAt") VALUES
      (1, 'Greg', 'Maire', 'Vieux Loup', 'salle', 'Fort de 20 ans d''expérience dans la cuisine polynésienne, Greg dirige notre service en salle avec passion et créativité. Formé aux îles Marquises, il apporte l''authenticité des saveurs du Pacifique à chaque interaction avec nos clients.', 'Accueil VIP et service attentionné', '20 ans d''expérience', 'Chef du service du soir', '/equipe/greg.jpg', NOW(), NOW()),
      (2, 'Alexis', 'Berthier', 'Gros Grizzly', 'salle', 'Spécialiste des cocktails fusion mêlant techniques françaises et ingrédients polynésiens, Alexis crée des boissons uniques qui racontent une histoire à chaque gorgée.', 'Cocktails signatures et vins fins', '15 ans d''expérience', 'Service continu', '/equipe/alex.png', NOW(), NOW()),
      (3, 'Quentin', 'Cialone', 'Cochon du seigneur', 'salle', 'Expert en relation client et ambiance festive, Quentin apporte sa touche unique aux soirées du Tiki. Sa créativité donne une nouvelle dimension à nos événements.', 'Organisation d''événements et soirées', '12 ans d''expérience', 'Chef du service du midi', '/equipe/quentin.jpeg', NOW(), NOW()),
      (4, 'Sophie', 'Martin', 'Chef pâtissière', 'cuisine', 'Avec son sens aigu du détail et sa passion pour les saveurs exotiques, Sophie crée des desserts qui sont de véritables œuvres d''art gourmandes.', 'Desserts polynésiens revisités', '10 ans d''expérience', 'Service du soir', '/equipe/chef1.jpg', NOW(), NOW()),
      (5, 'Lucas', 'Durand', 'Chef exécutif', 'cuisine', 'Passionné de cuisine fusion, Lucas combine les techniques françaises avec les saveurs du Pacifique pour créer des plats inoubliables.', 'Poissons et fruits de mer', '15 ans d''expérience', 'Service continu', '/equipe/chef2.jpg', NOW(), NOW())
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM personnel WHERE id IN (1, 2, 3, 4, 5)`);
    }
}
exports.InitialPersonnelData1641313444444 = InitialPersonnelData1641313444444;
//# sourceMappingURL=initial-data.js.map