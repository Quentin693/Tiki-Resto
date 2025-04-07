# Docker pour Tiki Resto

Ce guide explique comment utiliser Docker pour exécuter l'application Tiki Resto.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Mise en route

1. Clonez le dépôt :
   ```
   git clone [URL_DU_REPO]
   cd Tiki-Resto
   ```

2. Démarrez les conteneurs avec Docker Compose :
   ```
   docker-compose up -d
   ```

3. L'application sera accessible aux adresses suivantes :
   - **Frontend** : http://localhost:3000
   - **Backend API** : http://localhost:3001
   - **Adminer** (gestion de base de données) : http://localhost:8080
     - Système : PostgreSQL
     - Serveur : postgres
     - Utilisateur : postgres
     - Mot de passe : postgres
     - Base de données : tiki_resto

## Commandes utiles

- Démarrer les conteneurs :
  ```
  docker-compose up -d
  ```

- Arrêter les conteneurs :
  ```
  docker-compose down
  ```

- Voir les journaux des conteneurs :
  ```
  docker-compose logs -f
  ```

- Voir les journaux d'un conteneur spécifique :
  ```
  docker-compose logs -f [frontend|backend|postgres|adminer]
  ```

- Reconstruire les images (après modifications) :
  ```
  docker-compose up -d --build
  ```

## Persistance des données

Les données sont persistantes grâce aux volumes Docker :
- **postgres-data** : stocke les données de la base de données
- **uploads** : stocke les fichiers uploadés dans l'application

## Modifications de l'environnement

Pour modifier les variables d'environnement :

1. Éditez le fichier `docker-compose.yml` pour changer les valeurs dans la section `environment` de chaque service.
2. Relancez les conteneurs avec `docker-compose up -d`.

## Problèmes courants

- **Erreur de port déjà utilisé** : Assurez-vous qu'aucune autre application n'utilise les ports 3000, 3001, 5432 ou 8080.
- **Problèmes de connexion à la base de données** : Vérifiez que les variables d'environnement DB_* dans le service backend correspondent à celles du service postgres.

## Développement

Pour le développement, vous pouvez monter les dossiers source en volumes pour éviter de reconstruire les images à chaque modification :

```yaml
volumes:
  - ./src:/app/src  # Pour le frontend
  - ./backend/src:/app/src  # Pour le backend
```

Ajoutez ces lignes aux services correspondants dans `docker-compose.yml`. 