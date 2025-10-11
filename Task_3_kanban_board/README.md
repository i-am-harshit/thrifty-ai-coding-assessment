# 🗂️ Kanban Board – MERN Stack Application

A complete **Kanban Board Web Application** built with the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  
Manage your projects, boards, lists, and tasks in a simple, elegant, and responsive interface.

---

## 🚀 Features

### 🔐 Authentication

- User Signup & Login using **JWT Authentication**
- Secure password hashing with **Bcrypt.js**
- Server-side validation for all requests

### 🧩 Core Functionality

- **CRUD operations** for Boards, Lists, and Cards
- Create, update, delete, and move cards between lists
- Search and filter functionality for cards
- Fully responsive and minimal interface

### 🧠 Backend Highlights

- RESTful API built with **Node.js** and **Express.js**
- Secure API routes protected via JWT middleware
- Data persistence using **MongoDB** and **Mongoose**
- Helmet for securing HTTP headers

### 💻 Frontend Highlights

- Built with **React.js** and **Redux** for state management
- **React Router v6** for navigation
- API communication using **Axios**
- Styled using **Emotion (Styled Components)**
- Clean and modern UI with responsive design

---

## ⚙️ Tech Stack

| Layer        | Technologies                                                                         |
| :----------- | :----------------------------------------------------------------------------------- |
| **Frontend** | React.js, Redux, React Router v6, Axios, Emotion (Styled Components), HTML, CSS, JSX |
| **Backend**  | Node.js, Express.js, Express Validator, JWT, Bcrypt.js, Helmet, Body Parser          |
| **Database** | MongoDB, Mongoose                                                                    |

---

## 🧪 Installation & Setup

### 📦 Backend Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Run tests:
   ```bash
   npm test
   ```

The backend tests cover user signup, login, and basic board creation (protected route).

---

### 🖥️ Frontend Setup

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the React development server:
   ```bash
   npm start
   ```

The frontend will connect to your backend API defined in the `.env` file (default: `http://localhost:5000`).

---

## 🧰 Folder Structure

```
kanban-board/
├── client/                # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── tests/
│   └── package.json
│
└── README.md
```

---

## 📚 Purpose

This project was built to:

- Gain hands-on experience with the **MERN Stack**
- Understand **RESTful API** design and implementation
- Learn secure **user authentication**
- Implement **CRUD operations** with MongoDB
- Practice building a full-stack application from scratch

---

## 👨‍💻 Author

**Harshit Sharma**  
Full Stack Developer | MERN Enthusiast

📧 Email: [i.am.hrshit@gmail.com](mailto:i.am.hrshit@gmail.com)  
🔗 GitHub: [github.com/i-am-harshit](https://github.com/i-am-harshit/thrifty-ai-coding-assessment)

---

## 🪪 License

This project is licensed under the **MIT License** – feel free to use and modify it for your own learning and development.

---
