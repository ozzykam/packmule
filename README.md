# PackMule =�

> **A modern moving services marketplace that makes relocating seamless, transparent, and empowering.**

PackMule connects people who need moving assistance with skilled gig workers and entrepreneurs, creating a transparent platform where customers maintain control over their moving experience while providing workers with professional tools to manage their workflow.

**Live Demo:** [https://packmulepro.com](https://packmulepro.com)

---

## Project Overview

PackMule addresses the common pain points in the moving industry by providing:

- **For Customers:** Transparent pricing, reliable worker profiles, and full control over moving logistics
- **For Workers:** Professional tools for managing gigs, building reputation, and growing their moving business
- **For Everyone:** A secure, user-friendly platform that prioritizes trust and quality service

### Key Features

- **Dual Authentication System** - Separate login flows for customers and service providers
- **Gig Management** - Complete workflow from posting to completion
- **Profile & Reputation System** - Worker profiles with specialties and ratings
- **Transparent Pricing** - Clear, upfront cost estimates
- **Responsive Design** - Mobile-first interface for all device types
- **Secure Transactions** - JWT-based authentication with encrypted data

---

## Tech Stack

### Frontend - User Interface & Experience
*React-based SPA with modern state management and responsive design*
- **React 18** - Component-based UI framework
- **Redux Toolkit** - Predictable state management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server

### Backend API - Business Logic & Data Processing
*FastAPI-powered REST API with automatic validation and documentation*
- **Python 3.11+** - Core backend language
- **FastAPI** - Modern, high-performance web framework
- **Pydantic** - Data validation using Python type hints
- **Uvicorn** - ASGI web server implementation

### Authentication & Security
*JWT-based authentication with secure password hashing*
- **JWT (JSON Web Tokens)** - Stateless authentication
- **BCrypt** - Secure password hashing
- **Python-JOSE** - JWT implementation for Python
- **HTTP-only Cookies** - Secure token storage

### Database & Storage
*PostgreSQL for relational data with migration management*
- **PostgreSQL 14+** - Primary relational database
- **Psycopg3** - PostgreSQL adapter for Python
- **Custom Migration System** - Database schema management

### Cloud & Hosting
*Multi-platform deployment with Firebase and Railway*
- **Firebase Hosting** - Frontend deployment
- **Google Cloud Functions** - Serverless backend functions
- **Railway** - Backend API deployment
- **Firebase** - Additional cloud services

### Development & DevOps
*Containerized development with code quality tools*
- **Docker & Docker Compose** - Containerization
- **ESLint & Prettier** - Code formatting and linting
- **PgAdmin** - Database administration
- **Git** - Version control

---

## Prerequisites

- **Node.js** 20.x or higher
- **Python** 3.11 or higher
- **Docker & Docker Compose** (recommended)
- **PostgreSQL** 14+ (if running without Docker)
- **Git** for version control

---

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd packmule

# Create environment file
cp .env.sample .env
# Edit .env with your configuration

# Create required Docker volume
docker volume create pg-admin

# Start all services
docker-compose up
```

**Access Points:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Database Admin:** http://localhost:8082

### Option 2: Manual Setup

#### Backend Setup
```bash
cd api

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the API server
python run.py
```

#### Frontend Setup
```bash
cd ghi

# Install dependencies
npm install

# Start development server
npm run dev
```

---

##Project Architecture

```
packmule/
|-- api/                                # Python FastAPI Backend
|   |-- migrations/                     # Database migrations
|   |-- models/                         # Pydantic data models
|   |-- queries/                        # Database query functions
|   |-- routers/                        # API route handlers
|   |-- utils/                          # Helper utilities
|   |-- main.py                         # FastAPI application entry
|
|-- ghi/                                # React Frontend
|   |-- functions/                      # Firebase Cloud Functions
|   |-- public/                         # Static assets
|   |-- src/                            # React Application Source
|   |   |-- components/                 # React UI Components (20+ components)
|   |   |   |-- About.jsx               # About page with developer info
|   |   |   |-- HomePage.jsx            # Landing page component
|   |   |   |-- Nav.jsx                 # Navigation bar with mobile support
|   |   |   |-- GigMarketplace.jsx      # Main marketplace view
|   |   |   |-- CreateGigForm.jsx       # Gig creation interface
|   |   |   |-- CustomerDashboard.jsx   # Customer control panel
|   |   |   |-- PackerProfile.jsx       # Worker profile display
|   |   |   |-- RequireAuth.jsx         # Authentication wrapper
|   |   |   └-- ... (15+ more specialized components)
|   |   |
|   |   |-- app/                        # Redux Store Configuration
|   |   |   |-- store.js                # Central Redux store setup
|   |   |   └-- apiSlice.js             # RTK Query API slice
|   |   |
|   |   |-- hooks/                      # Custom React Hooks
|   |   |   └-- useAuth.js              # Authentication state management
|   |   |
|   |   |-- utils/                      # Frontend Utilities
|   |   |   |-- auth.js                 # Authentication helpers
|   |   |   └-- specialtyIcons.jsx      # Icon mapping utilities
|   |   |
|   |   |-- App.jsx                     # Root application component
|   |   |-- main.jsx                    # React application entry point
|   |   |-- types.js                    # TypeScript/PropTypes definitions
|   |   └-- index.css                   # Global styles and Tailwind imports
|
|-- docs/                               # Project documentation
|-- docker-compose.yaml                 # Development environment
```

---

##Environment Configuration

Create a `.env` file in the project root:

```env
# Database Configuration
POSTGRES_DB=your_database_name
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_secure_password

# JWT Security
SIGNING_KEY=your_jwt_signing_key

# API Configuration
CORS_HOST=http://localhost:5173
DATABASE_URL=postgresql://user:password@db/database_name

# Frontend Configuration
VITE_API_HOST=http://localhost:8000
BASE_URL=http://localhost:5173
```

> **Security Note:** Never commit actual credentials to version control. Use strong, unique values for production.

---

## API Documentation

The FastAPI backend automatically generates interactive API documentation:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Core API Endpoints

```
Authentication:
POST   /api/auth/signin      # User login
POST   /api/auth/signout     # User logout
POST   /api/auth/signup      # User registration

Gigs:
GET    /api/gigs            # List available gigs
POST   /api/gigs            # Create new gig
GET    /api/gigs/{id}       # Get gig details
PUT    /api/gigs/{id}       # Update gig

Users:
GET    /api/packers         # List service providers
GET    /api/packers/{id}    # Get packer profile
PUT    /api/packers/{id}    # Update packer profile

Specialties:
GET    /api/specialties     # List available specialties
```

---

## Key Features Demo

### Customer Journey
1. **Browse Services** - View available moving services and worker profiles
2. **Post Gig** - Create detailed moving requests with specific requirements
3. **Review Proposals** - Compare worker profiles, ratings, and pricing
4. **Manage Booking** - Track progress and communicate with chosen worker

### Worker Journey
1. **Profile Setup** - Create detailed profile with specialties and experience
2. **Browse Opportunities** - View and filter available moving gigs
3. **Submit Proposals** - Bid on jobs that match skills and availability
4. **Manage Workflow** - Track active gigs and build reputation

---

## Deployment

### Frontend (Firebase Hosting)
```bash
cd ghi
npm run build
firebase deploy --only hosting
```

### Backend (Railway)
The backend automatically deploys to Railway using the `railway.json` configuration when pushed to the main branch.

### Database
Production database runs on Railway with automated backups and scaling.

---

## Project Highlights

- **Full-Stack Ownership** - Designed and implemented entire application architecture
- **Modern Tech Stack** - Leverages cutting-edge technologies for optimal performance
- **Security First** - Implements industry-standard authentication and data protection
- **Scalable Design** - Built with growth and maintainability in mind
- **User-Centric** - Focused on solving real-world problems in the moving industry

---

##  Contact

**Aziz J. Kamara**  
Email: [aziz@magkam.com](mailto:aziz@magkam.com)  
Website: [magkam.com](https://magkam.com)  
Location: Twin Cities, Minnesota

---

## License

This project is proprietary software owned by Aziz J. Kamara. All rights reserved.

**2024 Aziz J. Kamara - PackMule Project**

*Unauthorized copying, distribution, or modification of this software is strictly prohibited.*

---

## Links

- **Live Demo:** [https://packmulepro.com](https://packmulepro.com)
- **Developer Portfolio:** [https://magkam.com](https://magkam.com)
- **API Documentation:** [Live API Docs](https://packmule-production.up.railway.app/docs)