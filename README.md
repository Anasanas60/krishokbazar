# KrishokBazar

<p align="center">
  <img src="./client/public/logo.png" alt="KrishokBazar Logo" width="120">
</p>

<h3 align="center">A Farm-to-Table Marketplace</h3>

**KrishokBazar** is a full-stack web application designed to bridge the gap between local farmers and consumers. It provides a digital platform where farmers can showcase their produce, and consumers can purchase fresh, sustainable goods directly from the source.

---

## ✨ Features

- **Role-Based Access Control:** Separate experiences for Admins, Farmers, and Consumers.
- **Farmer Profiles:** Farmers can create and manage their profiles, showcasing their farm and products.
- **Product Listings:** Farmers can list, update, and manage their available produce.
- **Consumer Dashboard:** Consumers can browse products by category, search for specific items, and view farmer profiles.
- **Direct Messaging:** Enables real-time communication between farmers and consumers to build trust and coordinate.
- **Secure Ordering:** A straightforward and secure system for consumers to place orders.
- **Admin Panel:** A comprehensive dashboard for administrators to manage users, products, categories, and orders.

## 🛠️ Tech Stack

| Category      | Technology                                      |
|---------------|-------------------------------------------------|
| **Frontend**  | React, Redux Toolkit, React Router, Tailwind CSS, Vite |
| **Backend**   | Node.js, Express.js, Sequelize ORM              |
| **Database**  | SQLite3                                         |
| **Security**  | JWT (JSON Web Tokens) for authentication        |

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- npm (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/krishokbazar.git
cd krishokbazar
```

### 2. Set Up the Backend (API)

Navigate to the API directory and install the dependencies.

```bash
cd api
npm install
```

Create a `.env` file in the `api` directory and add the following variables. For the default SQLite setup, no changes are needed.

```env
# .env for api

# Server Port
PORT=5000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=90d

# Database (Defaults to SQLite)
# DB_DIALECT=sqlite
# DB_STORAGE=./db/krishokbazar.sqlite

# Set to true to re-run database migrations (deletes existing data)
FORCE_SYNC=false

# Set to true on first run to populate the database with sample data
SEED_DB=true
```

**Important:** On the first run, set `SEED_DB=true` in your `.env` file to populate the database with initial data. You can set it to `false` after the first successful run.

Now, start the backend server:

```bash
npm start
```

The API will be running at `http://localhost:5000`.

### 3. Set Up the Frontend (Client)

Open a new terminal, navigate to the client directory, and install the dependencies.

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory and add the backend API URL.

```env
# .env for client
VITE_API_URL=http://localhost:5000
```

Now, run the client development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## 📂 Project Structure

```
krishokbazar/
├── api/                # Backend (Node.js/Express)
│   ├── controllers/    # Request handling logic
│   ├── db/             # Database connection & SQLite file
│   ├── models/         # Sequelize data models
│   ├── routes/         # API endpoint definitions
│   ├── .env            # Environment variables
│   └── index.js        # Server entry point
│
└── client/             # Frontend (React)
    ├── public/         # Static assets (logo, etc.)
    ├── src/
    │   ├── assets/     # Images, icons
    │   ├── components/ # Reusable React components
    │   ├── pages/      # Page-level components
    │   ├── redux/      # Redux Toolkit state management
    │   ├── App.jsx     # Main component with routing
    │   └── main.jsx    # Application entry point
    ├── .env            # Environment variables
    └── index.html      # Root HTML file
```

---

> Built with ❤️ for farmers and consumers.