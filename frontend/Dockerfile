# Usa una imagen base de Node.js para la fase de construcción
FROM node:18 AS build

# Establece el directorio de trabajo en /frontend
WORKDIR /frontend

# Copia el archivo de dependencias desde la carpeta frontend
COPY package*.json ./

# Instala dependencias
RUN npm install --legacy-peer-deps

# Copia el resto del código en la carpeta frontend
COPY . .

# Compila el proyecto de React
RUN npm run build

# Define el servidor de producción
FROM nginx:alpine

# Copia los archivos compilados de la fase de construcción al servidor Nginx
COPY --from=build /frontend/build /usr/share/nginx/html

# Expone el puerto 80 para el servidor Nginx
EXPOSE 80

# Comando para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]