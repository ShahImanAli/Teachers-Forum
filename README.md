# Teachers Forum

A comprehensive full-stack MERN platform designed to connect teachers and students. Teachers can create digital classrooms, post announcements, assign tasks, and manage submissions, while students can join classrooms to stay updated with coursework and seamlessly submit assignments.

## 🚀 Features

### For Teachers:
- **Classroom Management:** Create, update, and manage multiple classrooms.
- **Announcements & Tasks:** Post announcements or assign tasks with deadlines and file attachments.
- **Submission Tracking:** View and grade student submissions directly in the classroom feed.
- **Join Codes:** Generate secure join codes to easily invite students to the classroom.

### For Students:
- **Join Classrooms:** Easily join your teachers' classrooms using a unique join code.
- **Feed & Updates:** Stay up to date with the latest posts and assignments in your classroom feeds.
- **Submit Assignments:** Submit class tasks with descriptions and file attachments.
- **Discussions:** Comment on posts to ask questions or discuss topics with peers and teachers.

### General Features:
- **Authentication:** Secure signup/login using JWT (JSON Web Tokens) with distinct roles (`Teacher` and `Student`).
- **Profile Management:** View and manage user profiles.
- **Media Uploads:** Cloudinary integration for robust file attachments (images, documents, etc.).
- **Responsive Design:** A beautiful, fully responsive UI built with Tailwind CSS.

## 🛠️ Tech Stack

**Frontend:**
- [React](https://reactjs.org/) (Vite)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [Lucide React](https://lucide.dev/) (Icons)
- [Axios](https://axios-http.com/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- [Cloudinary](https://cloudinary.com/) (File Storage)
- [Multer](https://github.com/expressjs/multer) (File Upload handling)
- [Nodemailer](https://nodemailer.com/) (Email services)
- [JWT](https://jwt.io/) (Authentication)

## 📦 Local Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed. You will also need a [Cloudinary](https://cloudinary.com/) account for file storage.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd Teachers-Forum
```

### 2. Install Dependencies
You need to install dependencies for both the Frontend and Backend.

**For Backend:**
```bash
cd Backend
npm install
```

**For Frontend:**
```bash
cd ../Frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the **Backend** directory and add the following configurations (adjust values according to your setup):

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/teachers-forum
CORS_ORIGIN=http://localhost:5173

# Authentication
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

### 4. Run the Application

**Run Backend:**
```bash
cd Backend
npm run dev
```

**Run Frontend:**
```bash
cd Frontend
npm run dev
```

The application should now be running. The frontend will typically be accessible at `http://localhost:5173` and the backend strictly via API requests at `http://localhost:8000`.

## 📂 Folder Structure

```
Teachers-Forum/
│
├── Backend/               # Express server, MongoDB models, Routes, Controllers
│   ├── src/
│   │   ├── controllers/   # Request handlers (user, classroom, posts, etc.)
│   │   ├── models/        # Mongoose schema definitions
│   │   ├── routes/        # API endpoints
│   │   ├── middlewares/   # Authentication, Multer file upload
│   │   ├── utils/         # Helper functions (Cloudinary, ApiError, etc.)
│   │   └── app.js & index.js
│   └── package.json
│
├── Frontend/              # React application built with Vite
│   ├── src/
│   │   ├── assets/        # Images, Logos
│   │   ├── components/    # Reusable UI components (Navbar, Modals, etc.)
│   │   ├── context/       # React Context (AuthContext)
│   │   ├── pages/         # Page components (Home, Classroom, Login, etc.)
│   │   └── App.jsx
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── package.json
│
└── README.md
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page and open a pull request.


