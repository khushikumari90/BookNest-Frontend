# 📚 BookNest Frontend

BookNest is a full-stack e-commerce bookstore platform where users can discover, search, purchase, and review books online.

This repository contains the frontend application built using Angular for the BookNest platform.

---

# ✨ Features

## 👤 User Features

- User Registration & Login
- JWT Authentication
- GitHub OAuth Login
- Browse Books by Genre, Author, Featured, and New Arrivals
- Search Books by:
  - Title
  - Author
  - ISBN
  - Keyword
- View Detailed Book Information
- Shopping Cart Management
- Wishlist Management
- Wallet Integration
- Order Placement & Tracking
- Book Reviews & Ratings
- Notification Center
- Responsive UI

---

## 🛠️ Admin Features

- Admin Dashboard
- Manage Books
- Manage Inventory
- Manage Orders
- Manage Users
- View Analytics
- Moderate Reviews

---

# 🏗️ Tech Stack

- Angular
- TypeScript
- Bootstrap 5
- HTML5
- CSS3
- RxJS
- Angular Router
- JWT Authentication

---

# 📂 Project Structure

```bash
src/
 ┣ app/
 ┃ ┣ components/
 ┃ ┣ pages/
 ┃ ┣ services/
 ┃ ┣ guards/
 ┃ ┣ interceptors/
 ┃ ┣ models/
 ┃ ┗ shared/
 ┣ assets/
 ┣ environments/
 ┗ styles/
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <frontend-repository-url>
```

## 2️⃣ Navigate to Project Folder

```bash
cd BookNest-Frontend
```

## 3️⃣ Install Dependencies

```bash
npm install
```

## 4️⃣ Run Application

```bash
ng serve
```

Application will run at:

```bash
http://localhost:4200
```

---

# 🔐 Authentication

BookNest supports:

- JWT Authentication
- GitHub OAuth Login
- Role-Based Authorization
  - Customer
  - Admin

---

# 📡 API Integration

Frontend communicates with Spring Boot Microservices using REST APIs.

Example:

```ts
http://localhost:8080/api/v1/books
```

---

# 📱 Responsive Design

The UI is fully responsive and works on:

- Desktop
- Tablet
- Mobile Devices

---

# 🚀 Future Enhancements

- AI-Based Book Recommendations
- Dark Mode
- Progressive Web App (PWA)

---

# 👩‍💻 Developed By

Khushi Kumari

---

# 📄 License

This project is developed for educational and learning purposes.
