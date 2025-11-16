FROM node:20-alpine

# Arguments
ARG UID=1000
ARG GID=1000

# Install system dependencies
RUN apk add --no-cache git shadow

# Set working directory
WORKDIR /app

# Modify node user to match host user
RUN usermod -u ${UID} node 2>/dev/null || true && \
    groupmod -g ${GID} node 2>/dev/null || true

# Set permissions for working directory and node_modules
RUN chown -R ${UID}:${GID} /app && \
    mkdir -p /app/node_modules && \
    chown -R ${UID}:${GID} /app/node_modules

# Switch to node user
USER ${UID}:${GID}

# Expose port
EXPOSE 3000

CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port 3000"]
