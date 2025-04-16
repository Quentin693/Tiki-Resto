-- Ajouter la colonne customer_name à la table reservation si elle n'existe pas déjà
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'reservation' AND column_name = 'customer_name'
    ) THEN
        ALTER TABLE reservation ADD COLUMN customer_name VARCHAR(255) NULL;
    END IF;
END $$; 