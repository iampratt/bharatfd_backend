# BharatFD Backend

This API enables managing FAQs with multilingual support. It allows users to add, retrieve, and translate FAQs dynamically using Redis caching and Google Gemini API for fast performance.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [GET /api/faqs](#1-get-apifaqs)
  - [POST /api/createFAQ](#2-post-apicreatefaq)
  - [POST /api/updateFAQ/:id](#3-post-apiupdatefaqid)
  - [POST /api/deleteFAQ/:id](#4-post-apideletefaqid)
- [Docker](#docker)
  - [Building the Docker Image](#building-the-docker-image)
  - [Running the Docker Container](#running-the-docker-container)
- [Scripts](#scripts)

## Features

- Multilingual FAQs: Supports multiple languages (e.g., English, Hindi, Spanish, French, Japanese).
- WYSIWYG Editor for Answers: Rich text answers with Node-CKEditor integration.
- API with Query Parameters: Language selection through ?lang= query parameter.
- Caching with Redis: Enhanced performance by caching translations.

## Technologies Used

- **Backend**: Node.js, Express.js, Redis, Google Gemini API
- **Database**: MongoDB
- **Environment Management**: dotenv

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **Git** (for cloning the repository)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/BharatFD_Backend.git
   cd BharatFD_Backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```plaintext
     PORT=<PORT>
     MONGO_URL=<your mongodb uri>
     GEMINI_API_KEY=<your gemini api key>
     SUPPORTED_LANGUAGES=en,hi,es,fr,ja
     ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:<PORT>`.

## API Endpoints

### 1. **GET** `/api/faqs`

- **Description**: Retrieves a list of all FAQs.
- **Response**:
  ```json
  {
    "faqs": [
      {
        "id": "string",
        "question": "string",
        "answer": "string"
      }
    ]
  }
  ```

### 2. **POST** `/api/createFAQ`

- **Description**: Creates a new FAQ.
- **Request Body**:
  ```json
  {
    "question": "string",
    "answer": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "translations": [
      {
        "lang": "string",
        "question": "string",
        "answer": "string"
      }
    ]
  }
  ```

### 3. **POST** `/api/updateFAQ/:id`

- **Description**: Updates an existing FAQ.
- **Request Body**:
  ```json
  {
    "question": "string",
    "answer": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "question": "string",
    "answer": "string"
  }
  ```

### 4. **POST** `/api/deleteFAQ/:id`

- **Description**: Deletes an existing FAQ.
- **Response**:
  ```json
  {
    "message": "FAQ deleted successfully"
  }
  ```

## Docker

To run the application using Docker, follow these steps:

### Building the Docker Image

To build the Docker image, run:

```bash
docker build -t bharatfd_backend .
```

### Running the Docker Container

To run the Docker container, execute the following command:

```bash
docker run -d -p <PORT>:<PORT> --name bharatfd_backend --env-file .env bharatfd_backend
```

Replace `<PORT>` with the port number you have specified in your `.env` file.

## Scripts

The following scripts are available in the `package.json` file:

- **test**: Runs the test suite using Jest.

  ```bash
  npm run test
  ```

- **start**: Starts the server.

  ```bash
  npm run start
  ```

- **dev**: Starts the server with Nodemon for development.
  ```bash
  npm run dev
  ```
