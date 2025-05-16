#!/bin/bash
export PGPASSWORD=N72sD3eklUfrcvUyyQAh0bknVRVppY88

echo "Modification de la colonne items pour la rendre facultative..."
psql -h dpg-d0i9to3uibrs73a3er80-a.frankfurt-postgres.render.com -U tikiresto_user -d tikiresto -c "ALTER TABLE menus ALTER COLUMN items DROP NOT NULL;"

echo "Ajout d'une valeur par défaut NULL pour items..."
psql -h dpg-d0i9to3uibrs73a3er80-a.frankfurt-postgres.render.com -U tikiresto_user -d tikiresto -c "ALTER TABLE menus ALTER COLUMN items SET DEFAULT NULL;"

echo "Modification terminée avec succès!" 