:computer: #groupomania

Création réseau social Groupomania

Les fonctionnalités importantes :

- Mise en ligne d'une image et d'un titre
- Répondre au post, le modifier et le supprimer
- Créer, identifier et supprimer un compte
- Créer un compte administrateur via MySQL

 
Tout d'abord il faut cloner le repo : https://github.com/GuillaumeRossinot/projet7.git

Puis entrons dans le dossier Groupomania grâce au terminal ou à l'invite de commande :

cd groupomania

______________________________________________



Nous allons recréer la base de données.

Connectez vous à MySQL avec vos identifiants, puis:

Commande sql: 
``
CREATE DATABASE Groupomania;
``

Ensuite il faudrat importer le fichier groupomania.sql disponible dans le dossier Sql a la racine du projet.
 
#########################################
 
Retournons sur le projet, dans le terminal nous sommes dans le dossier groupomania.
Lancer les commandes suivantes:
- cd backend
- npm init
- npm install express sequelize mysql2 body-parser cors --save
    
Dans le dossier groupomania\backend\app\config, vous trouverez 2 fichier:
- db.config.js (la ou est stockez les identifiant de connection a la database)
- auth.config.js (fichier ou est stockez le token de connection)

Installer ensuite nodemon : 
- npm install -g nodemon

Et on lance le backend (dans le terminal toujours) :
- nodemon server
   

Votre backend est à présent opérationnel    
    
#########################################


Dans un nouveau terminal ouvert depuis le dossier groupomania,
utiliser la commande suivante : 
- cd frontend

Puis :

- ng serve --port 8081

##########################

Pour créer un compte admin :

Il suffit de créer un compte grâce au site sur la page signup

Allez ensuite dans MySQL où il faut rentrer le code suivant :

``
UPDATE users
SET isAdmin = 1
WHERE id = "(l’id du compte à passer en admin)";
``

Pour vous rendre sur l'application il suffit de taper http://localhost:8081/ dans votre barre de navigation.

Bonne navigation !