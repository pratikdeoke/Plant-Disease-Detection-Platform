# Plant-Disease-Detection-Platform 🌱

A full-stack web platform that enables users to detect plant diseases from leaf images and engage in a community discussion system. The application uses a Dockerized machine learning inference service for image-based disease classification and a scalable microservices architecture for production deployment.

---

## 🔗 Live Demo

🔴 **Live App:** https://plant-disease-detection-platform.vercel.app  
⚙️ **Backend API:** https://plant-disease-detection-platform-ba.vercel.app  
🤖 **ML Service:** https://plant-ml-service.onrender.com  
🔁 **Repository:** https://github.com/pratikdeoke/Plant-Disease-Detection-Platform

---

## ✨ Features

### 🌿 Disease Detection
- Upload plant leaf images for disease classification
- ML inference handled by a separate Dockerized TensorFlow service
- Returns disease name with confidence score (~92% accuracy)

### 👥 Community System
- User-generated posts related to plant health
- Like, comment, and interact on posts
- Discussion-driven knowledge sharing

### 🔐 Authentication & Security
- JWT-based authentication
- Protected routes for community actions
- Secure RESTful APIs

### ⚙️ System Architecture
- Frontend, backend, and ML inference as separate services
- UUID-based relational schema in PostgreSQL
- Scalable and production-ready deployment

---

## 🧠 System Design Highlights

- **Microservices Architecture:**  
  Frontend, backend, and ML inference service are independently deployed and scalable.

- **Dockerized ML Service:**  
  TensorFlow model served via a containerized service for consistent and isolated inference.

- **Secure Authentication:**  
  JWT-based authentication ensures secure access to protected APIs.

- **Relational Data Integrity:**  
  PostgreSQL with UUID-based schemas for users, posts, comments and likes.

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication

### ML Service
- TensorFlow
- Python
- Docker

### Deployment
- Frontend & Backend: Vercel
- ML Inference Service: Render (Docker)
- Database: Cloud-hosted PostgreSQL on Render

---
## 📁 Folder Structure

```text
Plant-Disease-Detection-Platform/
├── .gitignore
├── backend/
│   ├── package-lock.json
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── config.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── discussion.controller.js
│   │   │   └── prediction.controller.js
│   │   ├── db/
│   │   │   ├── discussion.queries.js
│   │   │   └── schema.sql
│   │   ├── db.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── rbac.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── discussion.routes.js
│   │   │   └── prediction.routes.js
│   │   ├── server.js
│   │   └── utils/
│   │       ├── id.js
│   │       ├── sendVerificationEmail.js
│   │       └── upload.js
│   ├── uploads/
│   │   ├── 1768035675175-1.jpg
│   │   └── 1769161977801-2.jpg
│   └── vercel.json
├── frontend/
│   ├── .gitignore
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public/
│   │   └── vite.svg
│   ├── README.md
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.js
│   │   │   ├── auth.api.js
│   │   │   ├── discussion.api.js
│   │   │   └── prediction.api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── Comment.jsx
│   │   │   ├── DateTime.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ui/
│   │   │       ├── avatar.jsx
│   │   │       ├── badge.jsx
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       ├── progress.jsx
│   │   │       ├── sheet.jsx
│   │   │       ├── table.jsx
│   │   │       └── textarea.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── index.css
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── main.jsx
│   │   └── pages/
│   │       ├── Community.jsx
│   │       ├── CreatePost.jsx
│   │       ├── History.jsx
│   │       ├── Login.jsx
│   │       ├── Post.jsx
│   │       ├── Register.jsx
│   │       ├── Upload.jsx
│   │       └── VerifyEmail.jsx
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── LICENSE
├── ml-service/
│   ├── __pycache__/
│   │   ├── model.cpython-310.pyc
│   │   └── prediction.cpython-310.pyc
│   ├── .gitignore
│   ├── .python-version
│   ├── app.py
│   ├── Dockerfile
│   ├── model.py
│   ├── my_model4.h5
│   ├── prediction.py
│   └── requirements.txt
├── package-lock.json
└── README.md
```

---

## 📋 Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- Docker
- PostgreSQL
- npm

---

## ⚙️ Installation & Setup
### 1️⃣ Clone Repository
```bash
git clone https://github.com/pratikdeoke/Plant-Disease-Detection-Platform.git  
cd Plant-Disease-Detection-Platform
```
---

### 2️⃣ Backend Setup
```bash
cd backend  
npm install
```
Create a `.env` file inside the `backend` directory:
```bash
PORT=3000  
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE  
JWT_SECRET=your_jwt_secret  
ML_SERVICE_URL=http://localhost:8000/predict  
```
Start the backend server:
```bash
npm run dev
```

```bash
Backend will run on:
http://localhost:3000
```
---

### 3️⃣ ML Service Setup (Dockerized)
```bash
cd ml-service  
```

Build the Docker image:
```bash
docker build -t plant-ml-service .
```

Run the container:
```bash
docker run -p 8000:8000 plant-ml-service
```

ML inference service will run on:
```bash
http://localhost:8000
```
---

### 4️⃣ Frontend Setup
```bash
cd frontend  
npm install
```

Create a `.env` file inside the `frontend` directory:
```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Start the frontend:
```bash
npm run dev
```
```bash
Frontend will run on:
http://localhost:5173
```
---

## 📘 API Documentation

### Base URL
```bash
/api/v1
```

### Authentication
```bash
POST /auth/register  
POST /auth/login  
```

### Disease Detection
```bash
POST /disease/predict  
```

### Community Routes
```bash
POST   /posts  
GET    /posts  
POST   /posts/:id/comments  
POST   /posts/:id/like  
```

---

## 🧪 Testing

Manual testing is currently used.

Testing tools:
- Postman
- Frontend UI testing
  
---

## 🚀 Deployment

- Frontend deployed on Vercel
- Backend deployed on Vercel
- ML inference service deployed as a Docker container on Render
- PostgreSQL hosted on cloud infrastructure

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Pratik Deoke  
GitHub: https://github.com/pratikdeoke

---

## 🤝 Contributors

Contributions are welcome.  
Fork the repository and submit a pull request.
