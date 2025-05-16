#!/bin/bash
export PGPASSWORD=N72sD3eklUfrcvUyyQAh0bknVRVppY88

echo "Ajout de la colonne imageUrl..."
psql -h dpg-d0i9to3uibrs73a3er80-a.frankfurt-postgres.render.com -U tikiresto_user -d tikiresto -c "ALTER TABLE menus ADD COLUMN IF NOT EXISTS \"imageUrl\" VARCHAR NULL;"

echo "Copie des données de pdfUrl vers imageUrl..."
psql -h dpg-d0i9to3uibrs73a3er80-a.frankfurt-postgres.render.com -U tikiresto_user -d tikiresto -c "UPDATE menus SET \"imageUrl\" = \"pdfUrl\" WHERE \"pdfUrl\" IS NOT NULL;"

echo "Suppression de la colonne pdfUrl..."
psql -h dpg-d0i9to3uibrs73a3er80-a.frankfurt-postgres.render.com -U tikiresto_user -d tikiresto -c "ALTER TABLE menus DROP COLUMN IF EXISTS \"pdfUrl\";"

echo "Migration terminée avec succès!" 