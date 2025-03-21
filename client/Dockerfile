# Use Node 18
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies first (to leverage Docker cache)
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application with hot reload
CMD ["npm", "start"]
