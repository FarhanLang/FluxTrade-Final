# FluxTrade 📈

FluxTrade is a modern, full-stack trading platform web application. It features a robust backend API for secure data management and a highly responsive, interactive frontend built with the latest React and Next.js technologies. 

## 🛠 Tech Stack

This project is structured as a monorepo containing both the frontend and backend applications.

### Frontend
- **Framework:** [Next.js 15](https://nextjs.org/) & React 19
- **Language:** TypeScript (85%)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with `tailwindcss-animate`
- **UI Components:** [Radix UI](https://www.radix-ui.com/) (shadcn/ui ecosystem)
- **Data Visualization:** [Recharts](https://recharts.org/) for interactive trading charts and data displays
- **Forms & Validation:** `react-hook-form` paired with `zod`

### Backend
- **Runtime:** Node.js (v20+)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** MongoDB (via [Mongoose](https://mongoosejs.com/))
- **Authentication:** JSON Web Tokens (JWT) & `bcrypt` for secure password hashing
- **Payments:** [Stripe](https://stripe.com/) API integration

---

## 📂 Project Structure

```text
FluxTrade-Final/
├── frontend/             # Next.js frontend application
│   ├── package.json      # Frontend dependencies & scripts
│   └── ...               # Pages, components, styles, and hooks
├── backend/              # Express API backend application
│   ├── server.js         # Main entry point for the API
│   ├── package.json      # Backend dependencies & scripts
│   └── ...               # Models, routes, and controllers
├── package.json          # Root dependencies (Stripe, etc.)
└── README.md
```

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Version 20.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FarhanLang/FluxTrade-Final.git
   cd FluxTrade-Final
   ```

2. **Install Root Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## ⚙️ Environment Variables

For the application to function correctly, you will need to set up environment variables for both the frontend and backend. 

### Backend (`backend/.env`)
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend (`frontend/.env.local`)
Create a `.env.local` file in the `/frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
```

---

## 🏃‍♂️ Running the Application

You will need to run both the frontend and backend servers concurrently during development.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
*The backend server will start on `http://localhost:5000` (or your configured port) using nodemon for hot-reloading.*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*The frontend development server will start on `http://localhost:3000`.*

---

## 🔐 Key Features

* **Secure Authentication:** User registration and login flows protected by JWT and Bcrypt hashing.
* **Real-time Data Visualization:** Interactive financial and stock charts powered by Recharts.
* **Modern UI/UX:** Fully accessible and responsive design using Radix UI primitives and Tailwind CSS.
* **Payment Processing:** Integrated with Stripe for secure financial transactions and funding.
* **Light/Dark Mode:** Built-in theme switching utilizing `next-themes`.

---

## 📜 License

This project is licensed under the ISC License.
