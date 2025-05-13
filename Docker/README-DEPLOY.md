# Guide de Déploiement de Tiki Resto en Production

Ce guide vous explique comment déployer l'application Tiki Resto (Next.js, NestJS et PostgreSQL) en production avec Docker sur votre propre serveur.

## Prérequis

- Un serveur VPS (recommandé : 2GB RAM minimum)
- Un nom de domaine configuré pour pointer vers l'IP de votre serveur
- Docker et Docker Compose installés sur le serveur
- SSH configuré pour accéder au serveur

## Étapes de déploiement

### 1. Préparation du serveur

Connectez-vous à votre serveur via SSH :

```bash
ssh utilisateur@votre-ip-serveur
```

Installez Docker et Docker Compose si ce n'est pas déjà fait :

```bash
# Pour Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker

# Ajoutez votre utilisateur au groupe docker pour éviter d'utiliser sudo
sudo usermod -aG docker $USER
# Déconnectez-vous et reconnectez-vous pour appliquer les changements
```

### 2. Configuration des DNS

Configurez vos enregistrements DNS pour pointer vers l'IP de votre serveur :

- `votredomaine.com` → IP_du_serveur
- `www.votredomaine.com` → IP_du_serveur
- `api.votredomaine.com` → IP_du_serveur
- `admin.votredomaine.com` → IP_du_serveur

### 3. Transfert des fichiers de déploiement

Transférez les fichiers de déploiement sur votre serveur :

```bash
scp -r Docker/ utilisateur@votre-ip-serveur:/chemin/vers/application
```

### 4. Déploiement

Connectez-vous à votre serveur, naviguez vers le répertoire de l'application et lancez le script de déploiement :

```bash
cd /chemin/vers/application
chmod +x deploy.sh
./deploy.sh
```

Suivez les instructions à l'écran :
1. Confirmez que vous souhaitez déployer en production
2. Entrez votre nom de domaine principal (ex: `votredomaine.com`)
3. Entrez votre adresse e-mail pour Let's Encrypt
4. Entrez un mot de passe sécurisé pour la base de données (ou laissez vide pour en générer un)

Le script va :
- Configurer Nginx avec vos domaines
- Obtenir des certificats SSL avec Let's Encrypt
- Construire et démarrer tous les conteneurs Docker
- Afficher les informations importantes à conserver

### 5. Vérification du déploiement

Une fois le déploiement terminé, vous pouvez accéder à :
- Frontend : `https://votredomaine.com`
- API : `https://api.votredomaine.com`
- Admin (Adminer) : `https://admin.votredomaine.com` (protégé par mot de passe)

### 6. Gestion après-déploiement

#### Mise à jour de l'application

Pour mettre à jour l'application après des modifications du code :

```bash
# Clonez le dépôt mis à jour ou tirez les dernières modifications
git pull

# Reconstruisez et redémarrez les conteneurs
docker-compose down
docker-compose build
docker-compose up -d
```

#### Sauvegarde de la base de données

Pour sauvegarder la base de données :

```bash
docker-compose exec postgres pg_dump -U postgres tiki_resto > backup_$(date +%Y%m%d).sql
```

#### Restauration de la base de données

Pour restaurer une sauvegarde :

```bash
cat backup_20240601.sql | docker-compose exec -T postgres psql -U postgres tiki_resto
```

#### Visualisation des logs

Pour voir les logs de l'application :

```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres
```

### 7. Résolution des problèmes courants

#### Problèmes de certificats SSL

Si les certificats SSL ne fonctionnent pas correctement :

```bash
# Réexécutez l'initialisation SSL
./init-ssl.sh
```

#### Application inaccessible

Si l'application n'est pas accessible :

```bash
# Vérifiez l'état des conteneurs
docker-compose ps

# Vérifiez les logs
docker-compose logs -f

# Redémarrez les services
docker-compose restart
```

#### Problèmes de base de données

Si la base de données pose problème :

```bash
# Vérifiez les logs de PostgreSQL
docker-compose logs -f postgres

# Redémarrez la base de données
docker-compose restart postgres
```

## Informations importantes

- **Ne perdez pas** les informations de connexion générées lors du déploiement
- Les certificats SSL sont automatiquement renouvelés tous les 90 jours
- Les données de la base de données et les uploads sont persistants et stockés dans des volumes Docker
- Pour toute modification des variables d'environnement, éditez le fichier docker-compose.yml et redéployez

## Sécurité

- L'accès à Adminer est protégé par mot de passe
- Les ports internes ne sont pas exposés directement
- Tous les services communiquent via le réseau Docker interne
- HTTPS est forcé sur tous les domaines

## Support

Si vous rencontrez des problèmes lors du déploiement, consultez les logs Docker pour plus d'informations. 