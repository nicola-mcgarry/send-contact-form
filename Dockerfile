# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure the environment variables are set in the correct format
ENV GMAIL_USER=${GMAIL_USER}
ENV GMAIL_PASS=${GMAIL_PASS}

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
