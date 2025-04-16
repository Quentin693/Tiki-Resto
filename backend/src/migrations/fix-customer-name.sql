-- Migration pour résoudre les problèmes de colonne customer_name
DO $$ 
BEGIN
    -- 1. Vérifier si la colonne 'customerName' existe (et n'est pas nullable)
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'reservation' AND column_name = 'customerName' AND is_nullable = 'NO'
    ) THEN
        -- Rendre d'abord la colonne nullable pour éviter l'erreur
        ALTER TABLE reservation ALTER COLUMN "customerName" DROP NOT NULL;
    END IF;

    -- 2. Vérifier si les deux colonnes existent
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'reservation' AND column_name = 'customerName'
    ) AND EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'reservation' AND column_name = 'customer_name'
    ) THEN
        -- Copier les valeurs non-null de customer_name vers customerName
        UPDATE reservation 
        SET "customerName" = customer_name 
        WHERE customer_name IS NOT NULL AND "customerName" IS NULL;
        
        -- Supprimer la colonne customer_name si elle existe déjà pour éviter la duplication
        ALTER TABLE reservation DROP COLUMN customer_name;
    END IF;

    -- 3. S'assurer que la colonne customerName existe et est nullable
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'reservation' AND column_name = 'customerName'
    ) THEN
        -- Si customerName n'existe pas mais customer_name existe, renommer la colonne
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'reservation' AND column_name = 'customer_name'
        ) THEN
            ALTER TABLE reservation RENAME COLUMN customer_name TO "customerName";
        ELSE
            -- Si aucune des deux n'existe, créer customerName
            ALTER TABLE reservation ADD COLUMN "customerName" VARCHAR(255) NULL;
        END IF;
    END IF;
END $$; 