# Chat-App-Server
Chat-App-Server est une API REST, le back end de Chat-app qui est une application de chat en temps réel basée sur une architecture de microservices. Elle utilise Docker pour simplifier le déploiement et l'isolation des services en production. Ce README fournit des instructions sur la configuration, le démarrage du projet, et d'autres opérations utiles.

## Prérequis
Avant de démarrer, assurez-vous que les outils suivants sont installés sur votre système :

- [nodejs](https://nodejs.org/en/download/)
- [vscode](https://code.visualstudio.com/download)

## Démarrage du Projet

Pour démarrer le projet, suivez ces étapes :

1. Cloner le dépôt : Clonez ce dépôt sur votre machine locale.
	```bash
	git clone https://gitlab.com/nguefackgilles/chat-application.git
	cd chat-app
	```

2. Configurer les Variables d'Environnement : Copiez le fichier .env.example en .env et modifiez les variables selon votre environnement.

	```bash
	cp .env.example .env
	```
3. Installer les dépendances node :

	```bash
	npm install
	```

4. Ouvrez le projet dans votre vscode, il devrait vous proposer d'installer les extensions et paramètres recommendées pour ce projet, présentes dans le dosser .vscode

5. Dans votre environnement de développement, des commandes ont été ajoutées dans votre vscode grâce au fichier task.json, vous permettant de run plus facilement le projet. Pour commmencer, appuyer sur **F1**, puis cherchez **Tasks: run task** dans le menu, et enfin choisissez la tâche à run :
   - Start FrontEnd : Permet de lancer le front end de l'application, c'est à dire l'application NextJS
   - Start BackEnd : Permet de run tout le back-end de l'application, c'est à dire tous les microservices + l'API Gateway
   - **Start API GW Service** : Permet de démarrer uniquement l'API Gateway sur le port **4000**
   - **Start chat Service** : Permet de démarrer uniquement le service chat sur le port **6000**
   - **Start user Service** : Permet de démarrer uniquement le service user sur le port **6001**
   - **Start notification** Service : Permet de démarrer uniquement le service notification sur le port **6002**
