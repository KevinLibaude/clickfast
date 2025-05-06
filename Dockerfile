FROM nginx:alpine
# Définir le répertoire de travail
WORKDIR /usr/share/nginx/html
# Copier les fichiers de l'application
COPY . .
# Exposer le port 80 (port par défaut de nginx)
EXPOSE 80
