# Présentation générale

Ce projet permet de gérer une bibliothèque d'utilisateurs et de films.

## Sommaire

 - [Récupération du projet](#récupération-du-projet)
 - [Démarrage du projet](#démarrage-du-projet)
   - [Lancement du container Docker](#lancement-du-container-docker)
   - [Lancement du server](#lancement-du-server)
 - [Utilisation du projet](#utilisation-du-projet)
 - [Fonctionnalités disponibles](#fonctionnalités-disponibles)
   - [Partie utilisateurs](#partie-utilisateurs)
   - [Partie films](#partie-films)

## Récupération du projet

Cloner le repository github:

`git clone https://github.com/Tartef/Node_project.git`

Dans le dossier Node_project, effectuer l'installation des dépendances:

`npm install`

Une fois les dépendances résolues, ajouter dans le dossier /server un fichier .env suivant le format du fichier .env-keep.

Les valeurs du .env sont celle de bases pour la configuration de la base de données (cf: TP Objection et Schwifty).
Concernant les valeurs du mailer, il faut se créer un compte sur le site https://ethereal.email/ et récupérer les valeurs pour le host, le user et le password. Le port est le 587.



## Démarrage du projet

Une fois la configuration terminée, pour lancer le projet, on passera par 2 étapes:

### Lancement des containers Docker

Pour créer le container MySQL docker, entrer la commande suivante dans un terminal:

`docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3307:3306 -d mysql:8`

Il faut ensuite créer le container RabbitMQ permettant de gérer le mailer via la commande:

`docker run -d --name rabbitmq -p 5672:5672  -p 15672:15672 rabbitmq:management`


### Lancement du server

Afin de démarrer le serveur, lancer la commande suivant dans votre terminal webstorm, situé dans le dossier racine du projet:

`npm start`


## Utilisation du projet

Rendez-vous a la page [localhost:3000/documentation](http://localhost:3000/documentation) de votre navigateur favoris. Vous aurez accès au projet
Il est également possible de se rendre à l'adresse [localhost:5672](http://localhost:5672) afin d'avoir la gestion de RabbitMQ, il faudra alors entrer en nom d'utilisateur et en mot de passe 'guest'.

## Fonctionnalités disponibles

Ce projet permet:

### Partie utilisateurs

Du côté des utilisateurs, on peut:

 - Créer des utilisateurs
 - Modifier des utilisateurs
 - Supprimer des utilisateurs
 - Voir la liste des utilisateurs
 - Ajouter un film en favoris

Les utilisateurs ont un rôle, par défaut "user".

### Partie films

 - Créer un film
 - Voir la liste des films
 - Modifier un film
 - Supprimer un film
 - Consulter la liste des utilisateurs ayant ajouté un film en favori
