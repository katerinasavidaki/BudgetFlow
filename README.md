# 💰 BudgetFlow

**BudgetFlow** is a simple yet complete personal finance tracking application. Users can securely log in, manage their income and expenses, categorize transactions, and filter based on date, category, type, and payment method.

---

## 🚀 Features

- JWT-based authentication (register/login)
- Default `USER` role assignment
- CRUD operations for transactions
- Categorization by:
  - Type (`INCOME`, `EXPENSE`)
  - Category (e.g. `FOOD`, `RENT`)
  - Payment Method (e.g. `CARD`, `CASH`)
- Advanced filtering:
  - Date (`from` / `to`)
  - Amount (`min` / `max`)
  - Type / Category / Method
- Dashboard with:
  - Total Income
  - Total Expenses
  - Balance
- Swagger UI for API testing
- Clean fullstack architecture using a monorepo (backend + frontend)

---

## 🛠️ Technologies Used

### 🔙 Backend
- Java 17
- Spring Boot 3
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- MySQL
- Gradle
- Swagger (SpringDoc OpenAPI)

### 🖥️ Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- ShadCN UI
- React Hook Form + Zod
- Axios

---

## ⚙️ Local Setup

### ✅ Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8+
- Gradle
- Git

---

### 📦 Clone the project

```bash
  git clone https://github.com/yourusername/BudgetFlow.git
  cd BudgetFlow
```

---

### 🗄️ Setup the database

1. Create a database:
   ```sql
   CREATE DATABASE budgetflowdb;
   ```

2. Add your credentials in a `.env` file (see `.env.example`).

---

### 🔧 Backend Setup

```bash
  cd backend
  ./gradlew bootRun
```

- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### 🖼️ Frontend Setup

```bash
  cd ../frontend
  npm install
  npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)

---

## 🚀 Build for Production (Frontend)

```bash
  npm run build
```

---

## 📁 Folder Structure

```
BudgetFlow/
├── backend/       → Spring Boot backend
├── frontend/      → React frontend
├── .gitignore
├── .env.example
└── README.md
```

---

## 🔐 .env.example

```env
# === Backend ===
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/budgetflowdb
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# === Frontend ===
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🙋 About the Author

> Developed with ❤️ by [Katerina Savidaki](https://github.com/katerinasavidaki)
