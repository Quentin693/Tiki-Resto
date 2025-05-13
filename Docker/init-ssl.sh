#!/bin/bash

# Script pour initialiser les certificats SSL avec Certbot

# Remplacez par votre adresse e-mail
EMAIL="admin@tikilyon.com"

# Remplacez par votre domaine principal et vos sous-domaines
DOMAINS=("tikilyon.fr" "www.tikilyon.fr" "api.tikilyon.fr" "admin.tikilyon.fr")

# Création des répertoires nécessaires
mkdir -p ./nginx/conf
mkdir -p ./nginx/certbot/conf
mkdir -p ./nginx/certbot/www

# Vérification de l'existence du fichier de configuration Nginx
if [ ! -f ./nginx/conf/default.conf ]; then
    echo "Le fichier de configuration Nginx n'existe pas. Veuillez le créer d'abord."
    exit 1
fi

# Création du fichier .htpasswd pour protéger l'accès à Adminer
if [ ! -f ./nginx/.htpasswd ]; then
    echo "Création du fichier .htpasswd pour sécuriser l'accès à Adminer"
    # Générer un mot de passe aléatoire de 16 caractères
    ADMIN_PASSWORD=$(openssl rand -base64 12)
    mkdir -p ./nginx
    
    # Utilisation de htpasswd (nécessite apache2-utils ou httpd-tools)
    # Adaptez selon votre environnement
    if command -v htpasswd &> /dev/null; then
        htpasswd -bc ./nginx/.htpasswd admin "$ADMIN_PASSWORD"
    else
        # Alternative avec openssl si htpasswd n'est pas disponible
        ENCRYPTED_PASSWORD=$(openssl passwd -apr1 "$ADMIN_PASSWORD")
        echo "admin:$ENCRYPTED_PASSWORD" > ./nginx/.htpasswd
    fi
    
    echo "Identifiants pour Adminer créés:"
    echo "Username: admin"
    echo "Password: $ADMIN_PASSWORD"
    echo "Conservez ces informations dans un endroit sûr!"
else
    echo "Le fichier .htpasswd existe déjà"
fi

# Démarrage de Nginx pour la validation du domaine
docker-compose up -d nginx

echo "Attente de 5 secondes pour que Nginx démarre..."
sleep 5

# Obtention des certificats pour chaque domaine
for DOMAIN in "${DOMAINS[@]}"; do
    echo "Création du certificat pour $DOMAIN"
    
    docker-compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN"
    
    # Vérification du succès
    if [ $? -ne 0 ]; then
        echo "Erreur lors de la création du certificat pour $DOMAIN"
    else
        echo "Certificat pour $DOMAIN créé avec succès"
    fi
done

# Redémarrage de Nginx pour appliquer les certificats
docker-compose restart nginx

echo "Configuration SSL terminée. Vos certificats sont installés et configurés."
echo "Vous pouvez maintenant lancer l'ensemble des services avec 'docker-compose up -d'"
echo "Les certificats seront automatiquement renouvelés avant leur expiration." 