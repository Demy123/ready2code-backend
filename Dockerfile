FROM node:20-bookworm-slim

# Install OpenJDK 17, GCC/G++, make, Python 3, and build utilities
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk-headless \
    g++ \
    make \
    python3 \
    python3-pip \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5001

CMD ["node", "src/index.js"]
