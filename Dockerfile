# Base image with Node.js and Debian (for native builds)
FROM node:18-bullseye

# Install Rust
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install dependencies needed for native modules and cargo builds
RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  pkg-config \
  libssl-dev \
  git \
  && apt-get clean

# Set the working directory
WORKDIR /app

# Copy files
COPY . .

# Install Node modules and compile native code
RUN npm install --force

# Build app (if there's a build script)
RUN npm run build || echo "No build script found, continuing..."

# Start app (adjust if your entry point is different)
CMD ["npm", "start"]
