# LearnHub - A Distraction-Free YouTube Learning Platform

LearnHub is a full-stack web application designed to transform YouTube playlists into a focused, course-like learning experience. Users can search for educational content, add playlists to their personal library, track their progress, and take notes on individual videos, all within a clean, distraction-free interface.

## Features
- **User Authentication:** Secure user registration and login system using JWT (JSON Web Tokens).
- **YouTube API Integration:** Search for YouTube playlists by keyword directly within the app.
- **Personal Course Library:** Users can add and remove courses from their personal dashboard.
- **Progress Tracking:** Mark individual videos as "complete" and view overall course progress on a progress bar.
- **Note-Taking:** A dedicated notes section for each video, with notes saved per-user.
- **Manual CSS Styling:** A custom-built, responsive UI using CSS Modules for each component.
- **Session Management:** User login persists during a browser session and is cleared upon closing the tab.

## Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3**
- **Spring Security** (for JWT authentication)
- **Spring Data JPA / Hibernate**
- **PostgreSQL**
- **Maven**
- **jjwt (Java JWT)**
- **Google API Client** (for YouTube Data API v3)

### Frontend
- **Next.js 14** (with App Router)
- **React 18**
- **CSS Modules**
- **Axios** (for API communication)

## Prerequisites
Before you begin, ensure you have the following installed:
- JDK 21 or later
- Apache Maven
- Node.js & npm
- PostgreSQL

## Setup and Installation

Follow these steps to get the project running locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. Backend Setup
The backend is a Spring Boot application.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  **Configure the Database:**
    * Create a new PostgreSQL database (e.g., `learnhub_db`).
3.  **Configure Application Properties:**
    * In `src/main/resources/`, you will find a file named `application.properties.example`.
    * Create a copy of this file and name it `application.properties`.
    * Open `application.properties` and fill in your PostgreSQL database credentials, a Base64-encoded JWT secret key, and your YouTube Data API v3 key.
4.  **Build and Run the Application:**
    * You can run the application directly from your IDE by running the `BackendApplication.java` file.
    * Alternatively, you can use Maven:
      ```bash
      # Build the project
      mvn clean install
      
      # Run the project
      mvn spring-boot:run
      ```
    * The backend server will start on `http://localhost:8080`.

### 3. Frontend Setup
The frontend is a Next.js application.

1.  Open a new terminal and navigate to the frontend directory (e.g., `learnhub-client`):
    ```bash
    cd learnhub-client 
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    * The frontend development server will start on `http://localhost:3000`.

### 4. Accessing the Application
You can now access the LearnHub application by navigating to `http://localhost:3000` in your web browser.
