FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Start script that waits for DB and runs migrations
CMD ["sh", "-c", "sleep 10 && npx prisma db push --force-reset && npx prisma db seed && npm run start:dev"]