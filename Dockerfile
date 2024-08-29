# Use a imagem base do Node.js
FROM node:18

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia o package.json e o pnpm-lock.yaml
COPY package*.json ./

# Instala as dependências
RUN npm install -g pnpm && pnpm install

# Copia o código fonte para o contêiner
COPY . .

# Expõe a porta que o servidor vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "pnpm", "start" ]
