# Présentation générale

Ce projet permet de gérer une bibliothèe de films.

## Sommaire


## Récupération du projet

Cloner le repository github:

`git clone https://github.com/Tartef/Node_project.git`

Dans le dossier Node_project, effectuer l'installation des dépendances:

`npm install`

Une fois les dépendances résolues, ajouter dans le dossier /server un fichier .env suivant le format du fichier .env-keep.

Les valeurs du .env sont celle de bases pour la configuration de la base de données (cf: TP Objection et Schwifty).


## Démarrage du projet

Une fois la configuration terminée, pour lancer le projet, on passera par 2 étapes:

### Lancement du container Docker

Pour créer le container MySQL docker, entrer la commande suivante dans un terminale:

`docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3307:3306 -d mysql:8`

### Lancement du server

Afin de démarrer le serveur, lancer la commande suivant dans votre terminal webstorm:

`npm start`


## Utilisation du projet

Rendez-vous a la page localhost:3000/documentation de votre navigateur favoris. Vous aurez accès au projet

## Fonctionnalités disponible

Ce projet permet:

### Partie utilisateur:

Du côté des utilisateurs, on peut:

 - Créer des utilisateurs
 - Modifier des utilisateurs
 - Supprimer des utilisateurs
 - Voir la liste des utilisateurs

Les utilisateurs ont un rôle, par défaut "user".

### Partie films

TODO