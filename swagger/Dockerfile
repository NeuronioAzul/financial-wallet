FROM nginx:alpine

# Copiar arquivos de documentação
COPY . /usr/share/nginx/html/

# Configuração customizada do nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

