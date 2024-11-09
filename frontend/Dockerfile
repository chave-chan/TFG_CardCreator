# Usa una imagen base de Node.js
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo de dependencias
COPY app/package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY app .

# Compila el proyecto de React
RUN npm run build

# Define el servidor de producción
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80 para el servidor Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]