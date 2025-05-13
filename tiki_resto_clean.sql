--
-- SQL dump adapté pour MariaDB
--

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

-- Les données seront importées séparément pour éviter les problèmes de syntaxe

