# Use an official Node.js 21 runtime as the base image
FROM node:21

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
