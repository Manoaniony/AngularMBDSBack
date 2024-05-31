# AngularMBDSMadagascar2024
# Membre du groupe
	28-Ramarolahy	Manoaniony 
	52-RAZAFINDRAKOTO	Manolotsoa Daniel

# Installation du projet sur votre machine locale
	git clone https://github.com/Manoaniony/AngularMBDSBack.git
	cd AngularMBDSBack
	executer npm install
	Créer un fichier .env dans la racine du projet

	MONGO_URI="url-de-l-instance de la BDD Mongo en Production"
	MONGO_URI_DEV="url-de-l-instance de la BDD Mongo en Locale"
	TOKEN_KEY="string à utiliser à la gestion des token"
	SALTROUNDS="string à utiliser à la gestion des mot de passe avec Bcrypt"
	CLOUD_NAME="nom-du-cloud-associé-à-la-profile-cloudinary"
	API_KEY="api-key-pour-gerer-d'upload"
	API_SECRET="api-secret-necessaire-pour-gerer-d'upload"
	PORT="port-pour-faire-marcher-le-backend-peut-être vide"

	executer npm run dev
	Le serveur backend est disponible sur http://localhost:8010/ si vous n'avez pas mis de valeur dans la variable d'environnement PORT.

# Fonctionnalités au niveau backend


## Tâches Manoaniony:

	Endpoint: /api/subject/:id/update
	Description: Mise à jour d'une matière
	Type: PUT

	Endpoint: /api/assignments
	Description: Création d'un assignment ou exercice
	Type: GET
	Description: Liste des assignments ou exercices
	Type: GET

	Endpoint: /api/assignments/:id/eleves
	Description: Ajout d'une note
	Type: POST

	Endpoint: /api/assignment/:id
	Description: Detail d'un assignment
	Type: GET
	Description: Suppression d'un assignment
	Type: DELETE

	Endpoint: /api/assignment/:id/update
	Description: Mise à jour d'un assignment
	Type: PUT

	Endpoint: /api/assignment/:id/notes/:matricule
	Description: Detail d'une note d'un étudiant
	Type: GET
	Description: Suppression d'une note d'un étudiant
	Type: DELETE

	Endpoint: /api/assignment/:id/notes/:matricule/update
	Description: Mise à jour d'une note d'un étudiant
	Type: GET


## Tâches: Manolotsoa

	Endpoint: /api/auth
	Description: Sert à obtenir un token
	Type: POST

	Endpoint: /api/users
	Description: Inscription
	Type: POST

	Endpoint: /api/upload_files
	Description: Upload image d'un professeur
	Type: POST

	Endpoint: /api/subjects
	Description: Liste des matières
	Type: GET
	Description: Création d'une matière
	Type: POST

	Endpoint: /api/subject/:id
	Description: Detail d'une matière
	Type: GET
	Description: Suppression d'une matière
	Type: DELETE

	Endpoint: /api/subject/:id/update
	Description: Mise à jour d'une matière
	Type: PUT

# Point difficile de votre projet:
	Utilisation de cloudinary et multer pour la gestion des uploads
	On a utilisé deux comptes differents dans render et github.
	Pour appliquer un changement dans render, il faut les synchroniser manuellement

# Les liens qui nous a aidé:
	https://cloudinary.com/documentation/node_quickstart
	https://andela.com/blog-posts/how-to-use-cloudinary-and-node-js-to-upload-multiple-images