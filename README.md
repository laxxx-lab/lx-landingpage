# LX Lab: API-First 5-Theme Portfolio Monorepo

This repository contains the complete codebase for the **LX Lab Portfolio**—a secure, monorepo application featuring a FastAPI backend and a Next.js frontend styled with a dynamic 5-theme custom engine (Vibe Coder, Professional, Brutalist, Glassmorphism, and Geometric).

## Architecture Overview

- **`/backend`**: Built with **FastAPI** & **SQLAlchemy ORM** (SQLite database by default). Protects routes using dual authentication (Admin JWT Session & rotatable API Keys).
- **`/frontend`**: Built with **Next.js** using the App Router. Runs fully themed visual designs configured entirely with CSS variables.

---

## Getting Started

### 1. Repository Git Setup
To track the entire project as a single workspace, run Git operations at the root folder:
```bash
# Initialize git at the root directory
git init
```

### 2. Configure Local Environments
Both services require environment files to operate:

- **Backend Config**:
  Copy `/backend/.env.example` to `/backend/.env` and edit your secrets:
  ```bash
  cp backend/.env.example backend/.env
  ```
- **Frontend Config**:
  Copy `/frontend/.env.example` to `/frontend/.env` (or `.env.local`):
  ```bash
  cp frontend/.env.example frontend/.env
  ```

---

### 3. Database Initialization & Customizable Seeding
The database schema is automatically generated and populated using the `/backend/seed.py` utility.

#### How to customize seed data:
1. **Generic Placeholders (Default)**: If no custom config is present, running the seed script initializes the database with generic placeholder profiles (Jane Doe & Alex Smith) and mock projects.
2. **Personalized Configuration**:
   - Copy `backend/seed_data.json.example` to `backend/seed_data.json`:
     ```bash
     cp backend/seed_data.json.example backend/seed_data.json
     ```
   - Edit the JSON arrays in `seed_data.json` to define your own projects, technologies, and member bios.
   - Run the seed script:
     ```bash
     cd backend
     python seed.py
     ```
   *(Note: `seed_data.json` is ignored by Git, ensuring your personal details remain local.)*

---

### 4. Running the Applications

#### Backend (FastAPI):
1. Navigate to `/backend` and initialize a virtual environment:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Initialize the database:
   ```bash
   python seed.py
   ```
4. Start the Uvicorn web server:
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *Swagger Docs are accessible at `http://localhost:8000/docs`.*

#### Frontend (Next.js):
1. Navigate to `/frontend`:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The application is accessible at `http://localhost:3000`.*

---

## Administrative Credentials

The database is seeded with a default administrator to access the `/admin` portal:
- **Username**: `admin`
- **Password**: `adminpassword` *(Loaded from your `ADMIN_PASSWORD` environment variable)*

Once logged into the Admin Panel, you can add projects, manage API keys, and update team profile fields directly from the browser.
