FROM node:20-alpine

# Arguments
ARG UID=1000
ARG GID=1000

# Install system dependencies
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Set permissions for node user
RUN chown -R node:node /app

USER node

# Expose port
EXPOSE 3000

CMD ["npm", "run", "dev"]
