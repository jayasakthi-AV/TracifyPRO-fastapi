

# 🚀 Tracify Pro – Inventory Management System

**Tracify Pro** is a full-stack inventory management web application that helps businesses track products, manage stock, and analyze inventory efficiently.
The project is built with modern technologies and deployed using industry-standard cloud platforms.

---

## 🌐 Live Demo

* **Frontend (Vercel)**:
  👉 [https://tracify-pro-fastapi.vercel.app](https://tracify-pro-fastapi.vercel.app)

* **Backend API (Render)**:
  👉 [https://tracifypro-fastapi-uyy1.onrender.com](https://tracifypro-fastapi-uyy1.onrender.com)

* **API Documentation (Swagger UI)**:
  👉 [https://tracifypro-fastapi-uyy1.onrender.com/docs](https://tracifypro-fastapi-uyy1.onrender.com/docs)

---

## ✨ Features

* 📦 Add, update, delete, and view products
* 🔍 Search products by ID, name, or description
* 🔃 Sorting by ID, name, price, and quantity
* 📊 Analytics dashboard for inventory insights
* 📥 Export product data as CSV
* 🔄 Undo delete functionality
* 🌐 Fully deployed (frontend + backend + database)
* ⚡ Fast and responsive UI

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* **Axios**
* **CSS (Custom UI styling)**
* **Vercel** (Deployment)

### Backend

* **FastAPI**
* **Python**
* **SQLAlchemy**
* **Uvicorn**
* **Render** (Deployment)

### Database

* **PostgreSQL**
* **Neon** (Serverless PostgreSQL)

---

## 🏗️ System Architecture

```
Frontend (React + Vercel)
        ↓
Backend API (FastAPI + Render)
        ↓
Database (PostgreSQL + Neon)
```

---

## 📂 Project Structure

```
TracifyPRO-fastapi/
│
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── main.py            # FastAPI entry point
├── database.py        # Database connection
├── database_models.py # SQLAlchemy models
├── models.py          # Pydantic schemas
├── requirements.txt   # Backend dependencies
└── README.md
```

---

## ⚙️ API Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/products/`     | Get all products  |
| GET    | `/products/{id}` | Get product by ID |
| POST   | `/products/`     | Add a new product |
| PUT    | `/products/{id}` | Update product    |
| DELETE | `/products/{id}` | Delete product    |

---

## 🚀 Local Setup (Optional)

### Backend

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

Backend requires the following environment variable:

```
DATABASE_URL=<Neon PostgreSQL connection string>
```

---

## 📌 Deployment

* **Frontend** deployed using **Vercel**
* **Backend** deployed using **Render**
* **Database** hosted on **Neon PostgreSQL**
* CORS configured for secure frontend–backend communication

---

## 🎯 Learning Outcomes

* Full-stack application development
* REST API design using FastAPI
* PostgreSQL database integration
* Cloud deployment and environment configuration
* Handling CORS and production issues
* Real-world debugging and deployment workflow

---

## 👩‍💻 Author

**Jayasakthi AV**
Computer Science & Business Systems (CSBS)

---

## ⭐ Acknowledgements

This project was built as a hands-on learning experience to understand real-world full-stack application development and deployment.

---

### 🎉 If you like this project, give it a ⭐ on GitHub!

