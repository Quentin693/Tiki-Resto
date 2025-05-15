#!/bin/bash
export PGPASSWORD=N72sD3eklUfrcvUyyQAh0bknVRVppY88
psql -h dpg-d0i9to3uibrs73a3er80-a.frankfurt-postgres.render.com -U tikiresto_user -d tikiresto -c "ALTER TABLE menus ADD COLUMN IF NOT EXISTS \"pdfUrl\" VARCHAR NULL;"
echo "Colonne pdfUrl ajoutée avec succès à la table menus!" 