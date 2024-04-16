# Étape 1: Utiliser une image de base Node.js sécurisée
FROM node:lts-slim AS builder

# Définir un argument pour le répertoire de travail
ARG WORKDIR=/app

# Créer un répertoire de travail
WORKDIR ${WORKDIR}

#Copier le code source de l'application
COPY package*.json dist ${WORKDIR}

# Installer les dépendances, incluant les 'devDependencies' nécessaires pour la construction
RUN npm ci --only=production && \
	npm cache clean --force && \
	rm -rf services/chat services/api-gateway services/notification services/socket

# Étape 6: Étape finale pour l'image de production
FROM node:lts-slim

# Définir un argument pour le répertoire de travail
ARG WORKDIR=/app

# Créer et définir un répertoire de travail
WORKDIR ${WORKDIR}

# Copier les fichiers de build du 'builder' à l'image slim
COPY --from=builder ${WORKDIR} ${WORKDIR}

# Changer l'utilisateur. Ne pas utiliser l'utilisateur root.
#USER node

# Exposer le port sur lequel votre application s'exécute
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["node", "services/user/Server.js"]
