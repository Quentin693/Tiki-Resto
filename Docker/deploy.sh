#!/bin/bash

# Script de déploiement pour Tiki Resto
set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Affichage des logs
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé. Veuillez l'installer d'abord."
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
fi

# Demander confirmation avant de continuer
read -p "Voulez-vous déployer Tiki Resto en production ? (o/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Oo]$ ]]; then
    log "Déploiement annulé."
    exit 0
fi

# Demander le domaine principal
read -p "Entrez votre nom de domaine principal (ex: votredomaine.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    error "Vous devez spécifier un nom de domaine."
fi

# Demander l'email pour Let's Encrypt
read -p "Entrez l'adresse e-mail pour Let's Encrypt: " EMAIL
if [ -z "$EMAIL" ]; then
    error "Vous devez spécifier une adresse e-mail."
fi

# Demander le mot de passe pour la base de données
read -p "Entrez un mot de passe sécurisé pour la base de données (laissez vide pour générer): " DB_PASSWORD
if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 12)
    log "Mot de passe de base de données généré: $DB_PASSWORD"
fi

# Mise à jour des fichiers de configuration
log "Mise à jour des fichiers de configuration..."

# Créer les répertoires nécessaires
mkdir -p ./nginx/conf
mkdir -p ./nginx/certbot/conf
mkdir -p ./nginx/certbot/www

# Mettre à jour le fichier docker-compose.yml avec le mot de passe DB
sed -i "s/postgres_secure_password/$DB_PASSWORD/g" docker-compose.yml

# Mettre à jour le fichier de configuration Nginx avec le domaine
sed -i "s/votredomaine.com/$DOMAIN/g" ./nginx/conf/default.conf
sed -i "s/api.votredomaine.com/api.$DOMAIN/g" ./nginx/conf/default.conf
sed -i "s/admin.votredomaine.com/admin.$DOMAIN/g" ./nginx/conf/default.conf

# Mettre à jour le frontend pour pointer vers l'API
sed -i "s/https:\/\/api.votredomaine.com/https:\/\/api.$DOMAIN/g" docker-compose.yml

# Mettre à jour le script d'initialisation SSL
sed -i "s/admin@votredomaine.com/$EMAIL/g" init-ssl.sh
sed -i "s/\"votredomaine.com\"/\"$DOMAIN\"/g" init-ssl.sh
sed -i "s/\"www.votredomaine.com\"/\"www.$DOMAIN\"/g" init-ssl.sh
sed -i "s/\"api.votredomaine.com\"/\"api.$DOMAIN\"/g" init-ssl.sh
sed -i "s/\"admin.votredomaine.com\"/\"admin.$DOMAIN\"/g" init-ssl.sh

# Rendre les scripts exécutables
chmod +x init-ssl.sh

# Démarrer le déploiement
log "Démarrage du déploiement..."

# Arrêter les conteneurs existants
docker-compose down

# Pull des dernières images
log "Téléchargement des images Docker..."
docker-compose pull

# Construction des images
log "Construction des images Docker..."
docker-compose build

# Initialiser les certificats SSL
log "Initialisation des certificats SSL..."
./init-ssl.sh

# Démarrer tous les services
log "Démarrage des services..."
docker-compose up -d

# Vérifier si les conteneurs sont en cours d'exécution
if [ $(docker-compose ps -q | wc -l) -gt 3 ]; then
    log "Déploiement réussi! Votre application est maintenant accessible à l'adresse:"
    log "- Frontend: https://$DOMAIN"
    log "- API: https://api.$DOMAIN"
    log "- Adminer (admin): https://admin.$DOMAIN"
    log "---------------------------------------------------"
    log "Informations importantes:"
    log "- Base de données: PostgreSQL"
    log "- Utilisateur DB: postgres"
    log "- Mot de passe DB: $DB_PASSWORD"
    log "- Base de données: tiki_resto"
    log "- Mot de passe Adminer: voir fin du script init-ssl.sh"
    log "---------------------------------------------------"
    log "Conservez ces informations dans un endroit sûr!"
else
    error "Le déploiement a échoué. Vérifiez les logs avec 'docker-compose logs'."
fi 