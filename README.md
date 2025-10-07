<div align="center">
  
  # 🎓 LearnHub

  <p>
    A distraction-free, full-stack web application that transforms YouTube playlists into a focused, course-like learning experience.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
    <img src="https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot"/>
    <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  </p>

</div>

---

## 📸 Screenshots

<p align="center">
  <img src="Images/Screenshot 2025-10-07 174144.png" alt="LearnHub Homepage" width="400"/>
  <img src="Images/Screenshot 2025-10-07 174317.png" alt="LearnHub Dashboard" width="400"/>
  <img src="Images/Screenshot 2025-10-07 174227.png" alt="LearnHub Search Results" width="400"/>
  <img src="Images/Screenshot 2025-10-07 174354.png" alt="LearnHub Video Player" width="400"/>
</p>

---

## ✨ Features

-   🔐 **Secure User Authentication:** Full registration and login system using JWT (JSON Web Tokens).
-   🔍 **YouTube API Integration:** Search for YouTube playlists by keyword directly within the app.
-   📚 **Personal Course Library:** Users can add and remove courses from their personal dashboard.
-   📊 **Progress Tracking:** Mark videos as "complete" and view overall course progress on a progress bar.
-   📝 **Note-Taking:** A dedicated notes section for each video, saved per-user.
-   🎨 **Custom Styling:** A fully custom, responsive UI built with pure CSS Modules.
-   🚪 **Session Management:** Login persists during a browser session and is cleared upon closing the tab.

---

## 🛠️ Tech Stack

| Category      | Technology                                    |
| ------------- | --------------------------------------------- |
| **Frontend** | `Next.js` `React` `CSS Modules` `Axios`         |
| **Backend** | `Java 21` `Spring Boot` `Spring Security (JWT)` `JPA/Hibernate` |
| **Database** | `PostgreSQL`                                  |
| **Build Tool**| `Maven` (Backend) `npm` (Frontend)            |

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

Ensure you have the following installed:
-   JDK 21 or later
-   Apache Maven
-   Node.js & npm
-   PostgreSQL

### Installation and Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/AyushManwatkar/LearnHub.git
    cd LearnHub
    ```

2.  **Backend Setup** - Navigate to the backend directory: `cd backend`
    - Create a new PostgreSQL database (e.g., `learnhub_db`).
    - In `src/main/resources/`, copy `application.properties.example` to a new file named `application.properties`.
    - Fill in your database credentials, JWT secret, and YouTube API key in the new `application.properties` file.
    - Build and run the application:
      ```bash
      # You can run from an IDE or use Maven
      mvn spring-boot:run
      ```
    - The backend will be running on `http://localhost:8080`.

3.  **Frontend Setup**
    - Open a new terminal and navigate to the frontend directory: `cd frontend` (or `learnhub-client`).
    - Install dependencies:
      ```bash
      npm install
      ```
    - Run the development server:
      ```bash
      npm run dev
      ```
    - The frontend will be running on `http://localhost:3000`.

4.  **Access the Application**
    Open your browser and navigate to `http://localhost:3000`. Enjoy! 🎉

---
