# EstateHub

Welcome to **EstateHub**! This project aims to create a dynamic and user-friendly online platform for property listings and transactions. EstateHub is designed to cater to real estate agents, property sellers, and potential buyers or renters, providing an intuitive interface for seamless interaction.

## Step-by-Step Development

### 1. **Project Setup**
1. **Repository Initialization**:
   - Created a new GitHub repository named `EstateHub`.
   - Cloned the repository to the local machine using:
     ```bash
     git clone https://github.com/yourusername/estatehub.git
     ```

2. **Directory Structure**:
   - Structured the project with two main directories:
     - `frontend`: For React-based user interface.
     - `backend`: For Node.js and Express-based server-side logic.

3. **Environment Setup**:
   - Installed **Node.js** and npm on the system.
   - Initialized `package.json` in both `frontend` and `backend` directories:
     ```bash
     npm init -y
     ```
   - Set up `.gitignore` to exclude `node_modules`, `.env`, and other sensitive files.


### 2. **Frontend Development**
1. **Bootstrapping**:
   - Created a React application using:
     ```bash
     npx create-react-app frontend
     cd frontend
     ```

2. **Installing Dependencies**:
   - Added essential libraries for the project:
     ```bash
     npm install react-router-dom axios tailwindcss formik yup leaflet react-leaflet
     ```

3. **Configuring Tailwind CSS**:
   - Installed and set up Tailwind CSS:
     ```bash
     npm install -D tailwindcss postcss autoprefixer
     npx tailwindcss init
     ```
   - Updated the `tailwind.config.js` file with custom paths.
   - Integrated Tailwind CSS into `index.css`:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

4. **Building Components**:
   - Created reusable components:
     - **Navbar**: Responsive navigation with links to home, search, and user profile.
     - **Footer**: Contact information and subscription options.
     - **SearchBar**: Advanced search functionality with filters.
   - Built key pages:
     - **HomePage**: Hero section, featured listings, and call-to-action banners.
     - **ListingPage**: Property search results with filters and sorting.
     - **AgentProfile**: Display agent details and their active property listings.
     - **PropertyDetailPage**: Show detailed information, images, and contact options.

5. **Map Integration**:
   - Integrated `Leaflet` for interactive maps:
     ```bash
     npm install leaflet react-leaflet
     ```
   - Displayed property locations using map markers.


### 3. **Backend Development**
1. **Setting Up Node.js and Express**:
   - Installed backend dependencies:
     ```bash
     npm install express mongoose dotenv body-parser cors jsonwebtoken bcryptjs
     ```

2. **Database Configuration**:
   - Installed and set up MongoDB:
     - Created schemas using Mongoose:
       - **User**: For user authentication and roles.
       - **Property**: For property listings with location, price, and amenities.
       - **Agent**: For agent profiles and linked properties.
   - Connected to the database using:
     ```javascript
     const mongoose = require('mongoose');
     mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
     ```

3. **Authentication**:
   - Implemented secure authentication using **JWT**:
     - Created login and registration routes.
     - Enforced middleware for protected routes.

4. **API Endpoints**:
   - Designed RESTful APIs for:
     - **Users**: Registration, login, and profile management.
     - **Properties**: CRUD operations on property listings.
     - **Agents**: Viewing and managing agent profiles.
     - **Reviews**: Submitting and viewing user feedback.

5. **Real-Time Communication**:
   - Integrated `Socket.io` for chat functionality:
     ```bash
     npm install socket.io
     ```
   - Enabled real-time messaging between users and agents/landlords.


### 4. **Integration**
1. **Connecting Frontend and Backend**:
   - Used **Axios** for API communication.
   - Set up `proxy` in the frontend `package.json` to avoid CORS issues.
   - Created reusable API service files for modular code.

2. **Testing**:
   - Tested APIs using **Postman**.
   - Verified seamless interaction between frontend and backend.

3. **Performance Optimization**:
   - Lazy-loaded components to improve loading speed.
   - Optimized database queries using Prisma for efficient data retrieval.


### 5. **Media Management**
- Integrated **Cloudinary** for image and video uploads:
  - Configured API keys in `.env` file.
  - Allowed users to upload property images via frontend forms.

### 6. **Final Testing and Feedback**
- Conducted cross-browser testing to ensure compatibility.
- Collected feedback for iterative improvements.
- Fixed minor bugs and optimized UI/UX based on user input.


## Summary
EstateHub was developed as a robust and scalable platform for real estate transactions. It combines advanced search filters, real-time communication, and responsive design to offer a seamless user experience. The project is fully deployed and ready for users.

For further details, refer to the full documentation included in the repository.


## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technological Stack](#technological-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits & License](#credits--license)
- [Contact](#contact)

## Project Overview

EstateHub will feature advanced search filters, interactive maps, detailed property listings, user reviews, agent profiles, and contact forms. It is built using modern web development practices to ensure a responsive and engaging user experience.

## Features

- **Advanced Search Filters**: Search for properties by location, price, type, and amenities.
- **Interactive Maps**: Use Mapbox and React Leaflet to view property locations and nearby amenities.
- **Detailed Property Listings**: Display comprehensive details, images, and features of properties.
- **User Reviews**: Allow users to read and submit reviews for properties and agents.
- **Agent Profiles**: Showcase real estate agents with their profiles, contact information, and listings.
- **Contact Forms**: Provide forms for inquiries and appointments.

## Technological Stack

### Frontend

- **React.js**: A JavaScript library for building user interfaces, providing a dynamic and responsive user experience.
- **React Router**: Handles navigation within the application, enabling seamless page transitions.
- **Tailwind CSS**: A utility-first CSS framework for creating custom designs quickly and efficiently.
- **Axios**: A promise-based HTTP client for making API requests from the frontend.
- **Formik/Yup**: Tools for handling form state and validation in React applications.
- **Leaflet**: An open-source library for interactive maps, used with React for displaying property locations.

### Backend

- **Node.js**: A JavaScript runtime for building scalable server-side applications.
- **Express.js**: A web application framework for Node.js, used to build the RESTful API.
- **Prisma**: An ORM (Object-Relational Mapping) tool for working with databases in a type-safe manner.
- **MongoDB**: A NoSQL database for storing property listings and user data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB, facilitating schema-based data modeling.
- **JWT (JSON Web Tokens)**: Used for secure authentication and protecting API endpoints.
- **Socket.io**: A library for real-time web applications, enabling features like chat.

### Other Technologies

- **Cloudinary**: A cloud service for image and video management, used for handling property images.
- **Git**: A version control system for tracking changes and collaboration.
- **Vercel**: A platform for deploying and hosting the frontend application.
- **Heroku**: A platform for deploying and managing the backend server.

## Installation

To get started with EstateHub, clone the repository and install the required dependencies:

```bash
git clone https://github.com/yourusername/estatehub.git
cd estatehub
npm install
```

## Usage

### Start the Backend Server

Navigate to the backend directory and start the server:

```bash
cd backend
npm start
```
## Contributing

We welcome contributions to enhance EstateHub! To contribute:

- Fork the repository.
- Create a new branch:
  ```bash
  git checkout -b feature/YourFeature
  git commit -am 'Add new feature'
  git push origin feature/YourFeature
  ```

## Credits & License

### Credits

- **React.js** - JavaScript library for building user interfaces.
- **React Router** - Declarative routing for React.
- **Tailwind CSS** - Utility-first CSS framework.
- **Axios** - Promise-based HTTP client.
- **Formik & Yup** - Form handling and validation tools.
- **Leaflet** - Open-source JavaScript library for interactive maps.
- **Node.js** - JavaScript runtime for server-side applications.
- **Express.js** - Web framework for Node.js.
- **Prisma** - ORM for database interactions.
- **MongoDB** - NoSQL database.
- **Mongoose** - ODM for MongoDB.
- **JWT** - JSON Web Tokens for secure authentication.
- **Socket.io** - Real-time communication library.
- **Cloudinary** - Cloud service for media management.
- **Vercel** - Frontend deployment platform.
- **Heroku** - Backend deployment platform.

### License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or suggestions, feel free to reach out:

- **Email**: umangraval749@gmail.com
- **GitHub**: [DepresseDeeZ](https://github.com/DepresseDeeZ)

