# Étape 1: Utiliser une image de base Node.js sécurisée
FROM node:lts-slim AS builder

# Définir un argument pour le répertoire de travail
ARG WORKDIR=/app
ARG SERVICE=api-gw

# Créer un répertoire de travail
WORKDIR ${WORKDIR}

#Copier le code source de l'application
COPY . .

RUN rm -rf node_modules docker-compose.yml

# Installer les dépendances, incluant les 'devDependencies' nécessaires pour la construction
RUN npm install --production=false --no-cache && \
	npm cache clean --force

# Compiler l'application pour la production
RUN npm run build

# Étape 5: Nettoyage, supprimer les 'devDependencies' qui ne sont pas nécessaires pour l'exécution
RUN npm prune --production

RUN rm -rf tsconfig.json README.md LICENSE CONTRIBUTING.md .env .env.example src dist/services/${SERVICE}/nodemon.json dist/services/chat dist/services/user dist/services/notification

# Étape 6: Étape finale pour l'image de production
FROM node:lts-slim

# Définir un argument pour le répertoire de travail
ARG WORKDIR=/app

# Créer et définir un répertoire de travail
WORKDIR ${WORKDIR}

# Copier les fichiers de build du 'builder' à l'image slim
COPY --from=builder ${WORKDIR} ${WORKDIR}

# Ajouter un utilisateur non root pour exécuter l'application
RUN groupadd -r ${SERVICE} && useradd -r -g ${SERVICE} ${SERVICE} \
	&& chown -R ${SERVICE}:${SERVICE} ${WORKDIR}

# Changer l'utilisateur. Ne pas utiliser l'utilisateur root.
USER ${SERVICE}

# Exposer le port sur lequel votre application s'exécute
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["node", "dist/services/${SERVICE}/Server.js"]
