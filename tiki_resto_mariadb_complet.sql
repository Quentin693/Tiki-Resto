--
-- SQL dump adapté pour MariaDB - Structure et données complètes
--

-- Désactiver les contraintes pendant l'import
SET FOREIGN_KEY_CHECKS=0;

-- Création du type d'énumération remplacé par une table de référence pour MariaDB
CREATE TABLE IF NOT EXISTS seafood_orders_status (
    status VARCHAR(20) NOT NULL PRIMARY KEY
);

-- Insertion des valeurs d'énumération
INSERT INTO seafood_orders_status (status) VALUES
    ('pending'),
    ('confirmed'),
    ('processing'),
    ('ready'),
    ('completed'),
    ('cancelled');

--
-- Structure de la table `carte_items`
--

CREATE TABLE IF NOT EXISTS carte_items (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    price decimal(10,2) NOT NULL,
    imagePath varchar(255) DEFAULT NULL,
    category varchar(255) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `events`
--

CREATE TABLE IF NOT EXISTS events (
    id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    description text NOT NULL,
    date varchar(255) NOT NULL,
    time varchar(255) NOT NULL,
    capacity varchar(255) NOT NULL,
    imagePath varchar(255) DEFAULT NULL,
    type varchar(255) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `gallery_items`
--

CREATE TABLE IF NOT EXISTS gallery_items (
    id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    description varchar(255) DEFAULT NULL,
    imagePath varchar(255) NOT NULL,
    category varchar(255) NOT NULL,
    displayOrder int(11) NOT NULL DEFAULT 999,
    isActive tinyint(1) NOT NULL DEFAULT 1,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `menu_items`
--

CREATE TABLE IF NOT EXISTS menu_items (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    price decimal(10,2) NOT NULL,
    imagePath varchar(255) DEFAULT NULL,
    category varchar(255) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `menus`
--

CREATE TABLE IF NOT EXISTS menus (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    price varchar(255) NOT NULL,
    items text NOT NULL,
    info varchar(255) DEFAULT NULL,
    highlight tinyint(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `personnel`
--

CREATE TABLE IF NOT EXISTS personnel (
    id int(11) NOT NULL AUTO_INCREMENT,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    service varchar(255) NOT NULL,
    role varchar(255) NOT NULL,
    description text DEFAULT NULL,
    speciality varchar(255) DEFAULT NULL,
    experience varchar(255) DEFAULT NULL,
    schedule varchar(255) DEFAULT NULL,
    imagePath varchar(255) DEFAULT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `reservation`
--

CREATE TABLE IF NOT EXISTS reservation (
    id int(11) NOT NULL AUTO_INCREMENT,
    customerName varchar(255) NOT NULL,
    customerEmail varchar(255) NOT NULL,
    customerPhone varchar(255) NOT NULL,
    numberOfGuests int(11) NOT NULL,
    reservationDateTime timestamp NOT NULL,
    specialRequests varchar(255) DEFAULT NULL,
    userId int(11) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isEvent tinyint(1) DEFAULT 0,
    tableNumber int(11) DEFAULT NULL,
    isArrived tinyint(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `seafood_order_items`
--

CREATE TABLE IF NOT EXISTS seafood_order_items (
    id varchar(36) NOT NULL,
    productId varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    quantity int(11) NOT NULL,
    unitPrice decimal(10,2) NOT NULL,
    isHalfDozen tinyint(1) NOT NULL DEFAULT 0,
    order_id varchar(36) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `seafood_orders`
--

CREATE TABLE IF NOT EXISTS seafood_orders (
    id varchar(36) NOT NULL,
    customerName varchar(255) NOT NULL,
    customerPhone varchar(255) NOT NULL,
    customerEmail varchar(255) DEFAULT NULL,
    pickupDate date NOT NULL,
    pickupTime varchar(255) NOT NULL,
    isPickup tinyint(1) NOT NULL DEFAULT 1,
    totalPrice decimal(10,2) NOT NULL,
    specialRequests text DEFAULT NULL,
    status varchar(20) NOT NULL DEFAULT 'pending',
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId int(11) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (status) REFERENCES seafood_orders_status(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `seafood_plateaux`
--

CREATE TABLE IF NOT EXISTS seafood_plateaux (
    id varchar(36) NOT NULL,
    plateauId varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    quantity int(11) NOT NULL,
    unitPrice decimal(10,2) NOT NULL,
    order_id varchar(36) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS users (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    role varchar(255) NOT NULL DEFAULT 'user',
    phone_number varchar(255) DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Structure de la table `wines`
--

CREATE TABLE IF NOT EXISTS wines (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    region varchar(255) NOT NULL,
    category varchar(255) NOT NULL,
    bottlePrice varchar(255) NOT NULL,
    glassPrice varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ajout des clés étrangères
ALTER TABLE seafood_plateaux
    ADD CONSTRAINT FK_seafood_plateaux_order_id FOREIGN KEY (order_id) REFERENCES seafood_orders(id) ON DELETE CASCADE;

ALTER TABLE seafood_order_items
    ADD CONSTRAINT FK_seafood_order_items_order_id FOREIGN KEY (order_id) REFERENCES seafood_orders(id) ON DELETE CASCADE;

--
-- Données pour la table `carte_items`
--

INSERT INTO carte_items (id, name, description, price, imagePath, category, createdAt, updatedAt) VALUES
(16, 'Tartare de boeuf', 'Frites fraiches & Bouquet de salade', 21.00, '/uploads/images/789e4106a9510e5758f1323d62a1bf0392.jpeg', 'plats', '2025-04-15 09:57:18', '2025-05-05 09:41:41'),
(4, 'Tataki de thon en croute de sésame', 'Sauce thaï, champignons sautés et légume croquants façon wok', 22.00, '/images/11089de9dd601532210ee8f589437272a1.jpeg', 'plats', '2025-04-07 10:28:25', '2025-04-07 10:28:38'),
(5, 'Panier Asiatique', 'Nems de poulet, gyozas de boeuf, samoussas aux légumes salade verte et menthe fraiche', 14.00, '/images/9ff10b177cae9a05defaf717122fe921b.jpeg', 'entrees', '2025-04-07 10:29:50', '2025-04-07 10:29:50'),
(6, 'Brioche perdue Nanterre', 'Boule de glace & caramel beurre salé', 8.00, '/images/4fdb03a296c2d1a4cbcc4ac9692723ab.jpeg', 'desserts', '2025-04-07 10:30:50', '2025-04-07 10:30:50'),
(7, 'Pornstar Martini', ' ', 10.00, '/images/241037c6a8d505d910602179dd55758640.jpeg', 'boissons', '2025-04-07 10:32:27', '2025-04-07 10:32:27'),
(8, 'Mojito', ' ', 10.00, '/images/a9a6dc619df4eb10e283b5ed17f6ce499.jpeg', 'boissons', '2025-04-07 10:32:58', '2025-04-07 10:32:58'),
(12, 'Burger du moment', 'Frites maison et bouquet de salade', 18.00, '', 'plats', '2025-04-15 09:54:38', '2025-04-15 09:54:38'),
(13, 'Cigaline de cochon grillée, jus corsé à la spianata', 'Pommes de terre grenaille et légume rôtis', 19.00, '', 'plats', '2025-04-15 09:55:20', '2025-04-15 09:55:20'),
(14, 'Onglet de boeuf en canon', 'Frites maison et bouquet de salade', 22.00, '', 'plats', '2025-04-15 09:56:00', '2025-04-15 09:56:00'),
(9, 'Planche de Charcuterie', 'Jambon Speck, Mortadelle IGP Bologne pistache, Spianata Romana,\nSpianata Piccante, Jambon cuit truffé, Pecorino primosale piment, Grissini', 18.00, '/uploads/images/772b42c63da9727226bec7b839883866.jpeg', 'entrees', '2025-04-15 09:43:37', '2025-04-15 10:00:22'),
(18, 'Houmous maison, seul ou à partager avec son pain grillé', 'Pois chiches, menthe fraiche, jus de citron, piment d''Espelette', 11.00, '', 'entrees', '2025-04-15 10:01:43', '2025-04-15 10:01:54'),
(19, 'Calamars de Patagonia croustillants', 'Emincé de calamars frits, piment d''Espelette et sauce aïoli', 12.00, '', 'entrees', '2025-04-15 10:02:43', '2025-04-15 10:02:43'),
(26, 'Café / Thé gourmand', ' ', 9.00, '', 'desserts', '2025-04-15 10:07:05', '2025-04-15 10:07:11'),
(27, 'Pina Colada', ' ', 10.00, '/uploads/images/470c15c1029e9ea889de0a5b454d505810.jpeg', 'boissons', '2025-04-15 10:07:57', '2025-04-15 10:07:57'),
(28, 'Sex on the beach', ' ', 10.00, '', 'boissons', '2025-04-15 10:08:16', '2025-04-15 10:08:16'),
(29, 'Cuba Libre', ' ', 9.00, '', 'boissons', '2025-04-15 10:08:24', '2025-04-15 10:08:24'),
(30, 'Caiprinha', ' ', 9.00, '/uploads/images/cee83adb19c4d2864424de84bfad5c66.jpeg', 'boissons', '2025-04-15 10:08:48', '2025-04-15 10:08:48'),
(31, 'Moscow / London Mule', ' ', 10.00, '', 'boissons', '2025-04-15 10:09:34', '2025-04-15 10:09:34'),
(32, 'Cocktail de fruits Sans Alcool', ' ', 8.00, '', 'boissons', '2025-04-15 10:09:53', '2025-04-15 10:09:53'),
(33, 'Friture d''eperlan', 'accompagné de sa sauce tartare', 12.00, '', 'entrees', '2025-05-05 09:16:28', '2025-05-05 09:16:28'),
(20, 'Salade de chèvre chaud', 'Segments d''agrumes, mélange de graines', 14.00, '', 'entrees', '2025-04-15 10:03:48', '2025-05-05 09:26:35'),
(37, 'Tartare de thon facon tahitienne', 'Frites fraiches & Bouquet de salade', 21.00, '/uploads/images/c721dfa717dde5e2e71f95683107c5239.jpeg', 'plats', '2025-05-05 09:42:18', '2025-05-05 09:42:18'),
(22, 'Poke Bowl', 'Vermicelle, Avocats, Carotte, Thon, Radis', 13.00, '', 'entrees', '2025-04-15 10:04:53', '2025-05-05 09:30:30'),
(1, 'Tataki de boeuf', 'A l''italienne', 12.00, '', 'entrees', '2025-04-02 16:02:20', '2025-05-05 09:31:15'),
(17, 'Risotto de coquillettes', 'Chiffonade de jambon truffé & oeuf parfait', 22.00, '', 'plats', '2025-04-15 09:58:17', '2025-05-05 09:34:11'),
(15, 'Steak d''espadon', 'Beurre blanc citronné, accompagnement du moment', 26.00, '', 'plats', '2025-04-15 09:56:37', '2025-05-05 09:34:46'),
(34, 'Tentacule de poulpe', 'Houmous, Pommes grenailles & ses légumes du soleil', 26.00, '', 'plats', '2025-05-05 09:35:30', '2025-05-05 09:35:30'),
(35, 'Tartaki', 'Tartare de boeuf et Tataki de boeuf 380g, frites fraiches, bouquet de salade', 39.00, '/uploads/images/cccba0db20dfc054e847947d1410686a6.jpeg', 'plats', '2025-05-05 09:36:39', '2025-05-05 09:37:17'),
(21, 'Tartare de thon facon tahitienne', 'Bouquet de salade', 12.00, '/uploads/images/df53af10398810942105f715365aff7764b.jpeg', 'entrees', '2025-04-15 10:04:35', '2025-05-05 09:38:33'),
(36, 'Tataki de boeuf', 'A l''italienne', 22.00, '/uploads/images/b2d11f735d365047d9b2a31102653c86e.jpeg', 'plats', '2025-05-05 09:39:47', '2025-05-05 09:39:47'),
(2, 'Sablé breton', ' ', 8.00, '/images/67143f6645c1036a95188696cf4820ffb.jpeg', 'desserts', '2025-04-02 16:04:35', '2025-05-13 09:23:28'),
(24, 'Tiramisu du moment', ' ', 8.00, '', 'desserts', '2025-04-15 10:06:19', '2025-05-13 09:23:44'),
(25, 'Coulant au chocolat', 'Glace framboise', 8.00, '', 'desserts', '2025-04-15 10:06:50', '2025-05-13 09:23:59'),
(38, 'Tomates Burrata', ' ', 17.00, '/uploads/images/52b51ba198de26d6b98cfbc6ac961f28.jpeg', 'entrees', '2025-05-13 09:34:38', '2025-05-13 09:34:38'),
(11, 'Cuissse de grenouilles comme en Dombes', 'Pommes de terre grenaille', 29.00, '/uploads/images/227d5ed32076dd59af8a54c88fdd8de6.jpeg', 'plats', '2025-04-15 09:53:13', '2025-05-13 09:40:07');

--
-- Données pour la table `events`
--

INSERT INTO events (id, title, description, date, time, capacity, imagePath, type, createdAt, updatedAt) VALUES
(3, 'Soirée Tapas', ' ', '2025-05-16', '20:00', '140', '/images/c6410f3f48be8978bcb3aeb256c22d799.jpeg', 'tapas', '2025-04-07 10:35:02', '2025-04-07 10:35:02'),
(5, 'Soirée Spectacle de dauphins', 'Venez profiter d''un moment chaleureux', '2025-04-25', '20:00', '120', '/images/cc4816e68e79c2ecdcb1914a0378c2b1.jpeg', 'brasero', '2025-04-07 17:00:27', '2025-04-22 11:19:19');

--
-- Données pour la table `gallery_items`
--

INSERT INTO gallery_items (id, title, description, imagePath, category, displayOrder, isActive, createdAt, updatedAt) VALUES
(3, 'Couché de Soleil ', 'Vue sur la mer', '/images/9aea7eb0eed4d9271dbed69188eac988.jpeg', 'restaurant', 999, 1, '2025-04-07 10:19:35', '2025-04-07 10:19:35'),
(4, 'Véranda du Tiki', 'Avec une vue sur le grand large', '/images/ce410ff1810fd6b8184a6e213e55946ef9.jpeg', 'restaurant', 999, 1, '2025-04-07 10:20:16', '2025-04-07 10:20:16'),
(5, 'Notre Bar d''exception', '', '/images/e729991013e6ed7deb57a36819ea2ee110.jpeg', 'restaurant', 999, 1, '2025-04-07 10:21:40', '2025-04-07 10:21:40'),
(6, 'Crème Brulée', '', '/images/495a9259a3fe8784840547ed482333ee.jpeg', 'dishes', 999, 1, '2025-04-07 10:22:15', '2025-04-07 10:22:15'),
(7, 'Brioche Perdue', '', '/images/e4a171e7cad3c22b71080b6284b590934.jpeg', 'dishes', 999, 1, '2025-04-07 10:22:30', '2025-04-07 10:22:30'),
(9, 'Panier Asiatique', '', '/images/6a6a641312986e7f22161ffac8612fd2.jpeg', 'dishes', 999, 1, '2025-04-07 10:23:15', '2025-04-07 10:24:32'),
(8, 'Tataki de Thon', '', '/images/9f1299e29624a5fd724da0f5b69ac86f.jpeg', 'dishes', 999, 1, '2025-04-07 10:22:54', '2025-04-07 10:24:55'),
(11, 'Table près de la mer', 'Profiter d''un moment entre amis ou en famille', '/uploads/images/d7301a4d7ad1b10d25b28c8425d109bc3d.jpeg', 'restaurant', 999, 1, '2025-04-15 09:40:55', '2025-04-15 09:40:55'),
(12, 'Vue imprenable', 'Profiter de notre vue magnifique sur le Grand Large', '/uploads/images/149d2bfbfec259d8db52bd46a9d8d453.jpeg', 'restaurant', 999, 1, '2025-04-15 09:41:44', '2025-04-15 09:41:44'),
(13, 'Couché de Soleil', 'Profiter de notre plus beau couché de soleil', '/uploads/images/40af5a8cb068c0c1ed4f495fbc61c455.jpeg', 'restaurant', 999, 1, '2025-04-15 09:42:22', '2025-04-15 09:42:22'),
(14, 'Cote de boeuf', 'Préparation au brasero', '/uploads/images/4e86886201bd706b28b6da3f54b1d734.jpg', 'dishes', 999, 1, '2025-04-22 11:53:28', '2025-04-22 11:53:28'),
(15, 'Veranda', 'Avec vue sur la mer', '/uploads/images/4235ddab1010721e184f546fb1672f24e3.jpg', 'restaurant', 999, 1, '2025-05-13 09:47:29', '2025-05-13 09:47:29');

--
-- Données pour la table `menu_items`
--

INSERT INTO menu_items (id, name, description, price, imagePath, category, createdAt, updatedAt) VALUES
(6, 'test', 'test', 18.00, '/images/10f10238e768e888f7fc13d1a4a4e7cba1.jpeg', 'entrees', '2025-04-02 13:21:01', '2025-04-02 13:21:01'),
(7, 'test', 'test', 18.00, '/images/6fc1698a9a9d7449ce24a4ad61fbd9bc.jpeg', 'entrees', '2025-04-02 15:28:27', '2025-04-02 15:28:27'),
(8, 'test', 'test', 28.00, '/images/a6fbdfda1d39ec7ed1091f3528a817ca8.jpeg', 'entrees', '2025-04-02 15:54:37', '2025-04-02 15:54:37');

--
-- Données pour la table `menus`
--

INSERT INTO menus (id, name, price, items, info, highlight) VALUES
(1, 'Menu Grenouilles à volonté', '35€', 'Velouté de Butternut ou Paté en croûte,  Bouquet de salade,Grenouilles à volonté,Mousse au chocolat ou Tarte fine aux pommes', 'Disponible le vendredi soir et le week-end', 1),
(2, 'Menu Affaire', '24€', '2 Entrées au choix,Viande ou Poisson,2 Desserts au choix', 'Disponible le midi du mardi au vendredi', 0);

--
-- Données pour la table `personnel`
--

INSERT INTO personnel (id, firstName, lastName, service, role, description, speciality, experience, schedule, imagePath, createdAt, updatedAt) VALUES
(2, 'Quentin', 'Cialone', 'salle', 'Responsable de Salle', 'Membre de l''équipe Tiki', 'Non spécifié', 'Non spécifié', 'Non spécifié', '/images/cfdca03868de56d28c9206eee6b6534f.jpeg', '2025-04-07 11:09:23', '2025-04-07 11:09:23'),
(1, 'Greg', 'Maire', 'salle', 'Patron ', 'Membre de l''équipe Tiki', 'Non spécifié', 'Non spécifié', 'Non spécifié', '/images/b10da1b1ac7746398b13b4a58d4fa284c.jpeg', '2025-04-07 09:47:07', '2025-04-07 09:47:07'),
(5, 'Sylvain', 'Alias Sly', 'cuisine', 'Chef de cuisine', 'Membre de l''équipe Tiki', 'Non spécifié', 'Non spécifié', 'Non spécifié', '/uploads/images/9da8468b6104b33dc6a3c20ff2b99689e.jpeg', '2025-04-15 09:39:53', '2025-04-15 09:39:53'),
(6, 'Alexis', 'Berthier', 'salle', 'Directeur de salle', 'Membre de l''équipe Tiki', 'Non spécifié', 'Non spécifié', 'Non spécifié', '/uploads/images/dfb7602361eb709c8c26a04c7e94056e.jpeg', '2025-05-13 09:46:03', '2025-05-13 09:46:03');

--
-- Données pour la table `reservation`
--

INSERT INTO reservation (id, customerName, customerEmail, customerPhone, numberOfGuests, reservationDateTime, specialRequests, userId, created_at, updated_at, isEvent, tableNumber, isArrived) VALUES
(6, 'Cialone Quentin', 'cialonequentin@gmail.com', '0709080706', 2, '2025-04-15 12:30:00', '', NULL, '2025-04-16 09:30:44', '2025-04-16 09:30:44', 0, NULL, 0),
(7, 'Alexis Berthier', 'cialonequentin@gmail.com', '0709080706', 7, '2025-04-15 12:30:00', '', 1, '2025-04-16 09:30:44', '2025-04-16 09:30:44', 0, NULL, 0),
(8, 'Cialone Quentin', 'cialonequentin@gmail.com', '0612345678', 7, '2025-04-15 13:30:00', '', 4, '2025-04-16 09:30:44', '2025-04-16 09:30:44', 0, NULL, 0),
(9, 'Alexis Berthier', 'cialonequentin@gmail.com', '0709080706', 8, '2025-04-16 12:45:00', '', NULL, '2025-04-16 09:32:03', '2025-04-16 09:32:03', 0, NULL, 0),
(41, 'TEST', 'cialonequentin@gmail.com', '0709080706', 2, '2025-04-29 14:30:00', '', NULL, '2025-04-27 01:34:01', '2025-04-28 16:41:07', 0, NULL, 0),
(42, 'Quentin', 'cialonequentin@gmail.com', '0662495424', 7, '2025-05-01 19:30:00', '', 3, '2025-04-30 23:24:45', '2025-04-30 23:24:45', 0, NULL, 0),
(49, 'Cialone Quentin', 'cialonequentin@gmail.com', '0662495424', 7, '2025-05-06 20:45:00', '', NULL, '2025-05-06 15:52:42', '2025-05-06 15:52:42', 0, NULL, 0),
(50, 'Cialone Quentin', 'cialonequentin@gmail.com', '0662495424', 7, '2025-05-06 20:00:00', '', NULL, '2025-05-06 15:57:52', '2025-05-06 15:57:52', 0, NULL, 0),
(11, 'Cialone Quentin', 'cialonequentin@gmail.com', '0709080706', 10, '2025-04-16 12:30:00', '', 3, '2025-04-16 10:56:26', '2025-04-16 17:25:23', 0, NULL, 0),
(19, 'Quentin', 'cialonequentin@gmail.com', '0662495424', 2, '2025-04-17 19:00:00', '', 3, '2025-04-17 14:30:56', '2025-04-17 14:30:56', 0, NULL, 0),
(23, 'Quentin', 'cialonequentin@gmail.com', '0662495424', 2, '2025-04-18 19:15:00', '', 3, '2025-04-18 15:51:41', '2025-04-18 15:51:41', 0, NULL, 0),
(24, 'Quentin', 'reservation@telephone.com', '0662495424', 8, '2025-04-24 14:00:00', '', NULL, '2025-04-23 13:38:55', '2025-04-23 22:02:09', 0, NULL, 0),
(25, 'Alexis Berthier', 'reservation@telephone.com', '0783287826', 6, '2025-04-24 21:00:00', '', NULL, '2025-04-24 14:31:42', '2025-04-24 14:31:42', 0, NULL, 0),
(26, 'Cialone Quentin', 'cialonequentin@gmail.com', '0662495424', 7, '2025-04-24 19:45:00', '', NULL, '2025-04-24 14:32:13', '2025-04-24 14:32:13', 0, NULL, 0),
(28, 'Cialone Quentin', 'cialonequentin@gmail.com', '0709080706', 6, '2025-04-25 20:00:00', '', NULL, '2025-04-25 01:34:45', '2025-04-25 01:36:00', 0, NULL, 0),
(29, 'Cialone Quentin', 'cialonequentin@gmail.com', '0662495424', 2, '2025-04-26 20:45:00', '', NULL, '2025-04-25 01:40:48', '2025-04-25 01:40:48', 0, NULL, 0),
(30, 'Cialone Quentin', 'cialonequentin@gmail.com', '0662495424', 8, '2025-04-26 20:45:00', '', NULL, '2025-04-25 01:45:12', '2025-04-25 01:45:12', 0, NULL, 0),
(31, 'CialoneCamille', 'cialonequentin@gmail.com', '0783287826', 20, '2025-04-26 03:55:00', 'ÉVÉNEMENT #1/10 (200 pers. total) - Type: private -  ', NULL, '2025-04-25 01:57:04', '2025-04-25 01:57:04', 0, NULL, 0),
(34, 'Cialone Quentin', 'cialonequentin@gmail.com', '0709080706', 20, '2025-04-25 05:00:00', 'ÉVÉNEMENT #1/2 (25 pers. total) - Type: special - ', NULL, '2025-04-25 02:00:09', '2025-04-25 02:00:09', 0, NULL, 0),
(35, 'Cialone Quentin', 'cialonequentin@gmail.com', '0709080706', 5, '2025-04-25 05:00:00', 'ÉVÉNEMENT #2/2 (25 pers. total) - Type: special', NULL, '2025-04-25 02:00:10', '2025-04-25 02:00:10', 0, NULL, 0),
(38, 'Greg Maire', 'cialonequentin@gmail.com', '0709080706', 11, '2025-04-26 12:30:00', '', NULL, '2025-04-26 11:39:36', '2025-04-26 11:39:36', 0, NULL, 0),
(39, 'Cialone Quentin', 'cialonequentin@gmail.com', '0709080706', 8, '2025-04-26 12:45:00', '', NULL, '2025-04-26 11:40:08', '2025-04-26 11:40:08', 0, NULL, 0),
(40, 'TEST', 'reservation@telephone.com', '0709080706', 2, '2025-05-02 12:30:00', '', NULL, '2025-04-27 01:11:03', '2025-04-27 01:11:03', 0, NULL, 0),
(44, 'Quentin', 'cialonequentin@gmail.com', '0662495424', 5, '2025-05-05 22:00:00', '', 3, '2025-05-05 16:01:57', '2025-05-05 16:02:57', 0, NULL, 0),
(36, 'Cialone Quentin', 'cialonequentin@gmail.com', '0662495424', 20, '2025-06-20 14:32:00', 'ÉVÉNEMENT #1/3 (55 pers. total) - Type: private - Type: private - ', NULL, '2025-04-25 13:32:45', '2025-04-28 15:04:15', 1, NULL, 0),
(43, 'Quentin', 'cialonequentin@gmail.com', '0662495424', 6, '2025-05-06 01:15:00', '', 3, '2025-05-05 15:07:55', '2025-05-06 16:44:51', 0, 145, 0),
(47, 'Cialone Quentin', 'cialonequentin@gmail.com', '0662495424', 2, '2025-05-06 19:15:00', '', NULL, '2025-05-06 15:40:13', '2025-05-06 16:44:52', 0, 135, 0),
(53, 'TEST', 'cialonequentin@gmail.com', '0709080706', 8, '2025-05-13 19:30:00', '[Réservation groupe: 8 personnes]', NULL, '2025-05-13 10:36:01', '2025-05-13 10:36:01', 0, NULL, 0),
(45, 'Quentin', 'cialonequentin@gmail.com', '0662495424', 8, '2025-05-15 14:30:00', '', 3, '2025-05-06 09:47:30', '2025-05-13 10:36:34', 0, 135, 0),
(54, 'Cialone Quentin', 'cialonequentin@gmail.com', '0662495424', 7, '2025-05-16 12:30:00', '', NULL, '2025-05-13 10:45:15', '2025-05-13 10:45:15', 0, NULL, 0),
(52, 'Cialone Quentin', 'cialonequentin@gmail.com', '0612345678', 7, '2025-05-13 14:00:00', '', NULL, '2025-05-13 10:35:29', '2025-05-13 10:47:00', 0, 0, 0),
(48, 'Cialone Quentin', 'cialonequentin@gmail.com', '0662495424', 2, '2025-05-06 19:15:00', '', NULL, '2025-05-06 15:50:48', '2025-05-06 15:50:48', 0, NULL, 0);

--
-- Données pour la table `seafood_order_items`
--

INSERT INTO seafood_order_items (id, productId, name, quantity, unitPrice, isHalfDozen, order_id) VALUES
('fa248aad-07c2-432d-9d39-c6394e3d66df', 'crevette-grise', 'Crevette grise fraîches les 100g', 1, 12.00, 0, '9360cf65-04cc-4146-a80c-ff6603600604'),
('1a3f3c9f-a590-4861-b3ca-0b2d14a61e83', 'fines', 'Fines de claire (12 ou 6)', 2, 24.00, 0, '3499864c-28c8-43bc-ad72-6add4c4b104a'),
('7ec40f76-a30e-4135-a6d7-ff34dda92a51', 'tourteau', 'Tourteau entier frais & sa mayonnaise', 1, 39.90, 0, '4b2af0d8-4a00-4677-bb44-d30c05efae53'),
('28435b2a-def4-4b21-b79a-7eebef5cdd2e', 'homard', 'Homard entier frais & sa mayonnaise', 1, 71.00, 0, '4b2af0d8-4a00-4677-bb44-d30c05efae53'),
('f0bdbb45-0e1c-4bae-abb0-46f81c34396d', 'fines', 'Fines de claire (12 ou 6)', 1, 24.00, 0, '588d0b3a-1929-412d-a0ce-fe376766850d'),
('9d1ec063-b172-46b1-a522-a2568416867a', 'homard', 'Homard entier frais & sa mayonnaise', 1, 71.00, 0, '588d0b3a-1929-412d-a0ce-fe376766850d'),
('649722aa-82ca-401c-b3fa-e969cd32cd82', 'crevettes', 'Bouquet de crevettes (6)', 1, 12.00, 0, 'cbff4376-8016-4037-bea3-5c27206d205f'),
('beaf450b-ad71-4a48-9297-0b1a393864b1', 'tourteau', 'Tourteau entier frais & sa mayonnaise', 1, 39.90, 0, 'cbff4376-8016-4037-bea3-5c27206d205f'),
('e7db4c9c-3086-497e-9d9e-1de99d27956a', 'bulots', 'Bulots (300g)', 1, 14.00, 0, '50019cf5-2578-4207-a3a6-9e7da21e0042');

--
-- Données pour la table `seafood_orders`
--

INSERT INTO seafood_orders (id, customerName, customerPhone, customerEmail, pickupDate, pickupTime, isPickup, totalPrice, specialRequests, status, createdAt, updatedAt, userId) VALUES
('9360cf65-04cc-4146-a80c-ff6603600604', 'Cialone Quentin', '0709080706', 'cialonequentin@gmail.com', '2025-04-19', '19:30', 1, 12.00, '', 'pending', '2025-04-17 15:16:18', '2025-04-17 15:16:18', NULL),
('3499864c-28c8-43bc-ad72-6add4c4b104a', 'Cialone Quentin', '0662495424', 'cialonequentin@gmail.com', '2025-04-19', '19:30', 1, 48.00, '', 'pending', '2025-04-17 18:55:54', '2025-04-17 18:55:54', 3),
('4b2af0d8-4a00-4677-bb44-d30c05efae53', 'Cialone Quentin', '0662495424', 'cialonequentin@gmail.com', '2025-04-26', '19:30', 1, 110.90, '', 'pending', '2025-04-22 12:36:49', '2025-04-22 12:36:49', 3),
('588d0b3a-1929-412d-a0ce-fe376766850d', 'Cialone Quentin', '0662495424', 'cialonequentin@gmail.com', '2025-04-26', '19:30', 1, 95.00, '', 'completed', '2025-04-25 12:55:18', '2025-04-25 12:55:18', 3),
('cbff4376-8016-4037-bea3-5c27206d205f', 'Alexis Berthier', '0612345678', 'reservation@telephone.com', '2025-05-01', '19:30', 1, 51.90, '', 'pending', '2025-04-28 15:19:23', '2025-04-28 15:19:23', NULL),
('50019cf5-2578-4207-a3a6-9e7da21e0042', 'Greg Maire', '0612345678', 'cialonequentin@gmail.com', '2025-05-02', '19:30', 1, 14.00, '', 'pending', '2025-04-28 15:19:55', '2025-04-28 15:19:55', NULL);

--
-- Données pour la table `seafood_plateaux`
--

INSERT INTO seafood_plateaux (id, plateauId, name, quantity, unitPrice, order_id) VALUES
('3495a6ad-00c9-4407-b595-5c702fd283e2', 'plateau-estival', 'Plateau Estival', 1, 72.00, '50019cf5-2578-4207-a3a6-9e7da21e0042');

--
-- Données pour la table `users`
--

INSERT INTO users (id, name, email, password, role, phone_number, created_at, updated_at) VALUES
(1, 'Admin User', 'admin@example.com', '$2b$10$3cpJf0GkDmS5Am3UZ6CbOOZIwFnBkI03V54dNUV3YFwupQSD9QYc2', 'admin', '0612345678', '2025-04-02 18:18:00', '2025-04-02 18:18:00'),
(3, 'Quentin', 'cialonequentin@gmail.com', '$2b$10$/Ug1ym6t/UDkjpmuxdcQoO9JxBNSPu3.Ry5hECx.EZGUmG3.GlwXi', 'user', '0662495424', '2025-04-16 09:59:17', '2025-04-16 09:59:17'),
(4, 'Tic', 'tic@tiki-resto.fr', '$2b$10$Gq7y7a4tHRKHNVt05sn1YOnUOxvqPTnZPkqTtXSLz.OwzPT1ZBu9K', 'admin', '0612345678', '2025-04-16 10:13:17', '2025-04-16 10:13:17'),
(5, 'Alexis', 'alexis@tiki-resto.fr', '$2b$10$Gq7y7a4tHRKHNVt05sn1YOnUOxvqPTnZPkqTtXSLz.OwzPT1ZBu9K', 'admin', '0612345678', '2025-04-16 10:13:17', '2025-04-16 10:13:17');

--
-- Données pour la table `wines`
--

INSERT INTO wines (id, name, region, category, bottlePrice, glassPrice) VALUES
(3, 'Macon Tradition - 2022', 'Domaine Collovray Terrier', 'blancs', '23', '5'),
(4, 'Viognier - 2022', 'Domaine Janasse', 'blancs', '26', '6'),
(5, 'Côtes du Rhône Temps est venu - 2023', 'Domaine Stéphane Ogier', 'blancs', '18', NULL),
(6, 'Crozes Hermitage - 2023', 'Domaine Laurent Combier - Cuvée L', 'blancs', '30', NULL),
(7, 'Saint Veran - 2022', 'Domaine Collovray terrier', 'blancs', '36', '7'),
(8, 'La Begude - 2022', 'AOP Bandol', 'roses', '43', NULL),
(9, 'Maur & more', 'Côtes de provence', 'roses', '35', '6'),
(2, 'Petit Lebrun Grand cru blanc de blanc', ' ', 'champagnes', '59', '13'),
(10, 'Ruinart Blanc de blanc', ' ', 'champagnes', '140', NULL),
(1, 'Santenay - 2022', 'Domaine Lucien Muzard', 'rouges', '55', NULL),
(11, 'La roilette - 2022', 'AOP Fleurie', 'rouges', '36', NULL),
(12, 'Terre de Bussière - 2022', 'Domaine de la Janasse IGP', 'rouges', '21', NULL),
(13, 'SyrahVissante - 2023', 'Domaine Louis Chèze', 'rouges', '24', NULL);

-- Réactiver les contraintes après l'import
SET FOREIGN_KEY_CHECKS=1; 