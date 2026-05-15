# 🚀 Backend Setup Guide

This guide will help you set up the WeekLog API backend in under 5 minutes.

## Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
SUPABASE_URL=your-project-ref
SUPABASE_PASSWORD=your-password
SUPABASE_USER=postgres
SUPABASE_PORT=5432
SUPABASE_DB=postgres
DEBUG=True
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

## Step 3: Create Database Tables

The first time you run the app, tables are created automatically. If you want to use migrations:

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Run migration
alembic upgrade head
```

## Step 4: Run the Server

```bash
uvicorn app.main:app --reload
```

✅ Server is running at `http://localhost:8000`

## Step 5: Test the API

Open your browser to `http://localhost:8000/docs` to see the interactive Swagger UI

Or test with curl:
```bash
# Health check
curl http://localhost:8000/health

# List reports (empty initially)
curl http://localhost:8000/api/v1/weekly-reports/

# Create a report
curl -X POST http://localhost:8000/api/v1/weekly-reports/ \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","note":"Completed task 1"}'
```

## Step 6: Connect Frontend

Update `frontend/lib/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:8000/api/v1";
// Replace all fetch calls to use this base URL
```

Add to `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Architecture Overview

```
Request Flow:
┌─────────────┐
│  Frontend   │ (Next.js)
│  (port 3000)│
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────────────────────────────┐
│          FastAPI Backend            │
│          (port 8000)                │
│  ┌─────────────────────────────┐   │
│  │  Routes (endpoints/)         │   │
│  │    │                         │   │
│  │    ▼                         │   │
│  │  Services (services/)        │   │
│  │    │                         │   │
│  │    ▼                         │   │
│  │  CRUD (crud/)               │   │
│  │    │                         │   │
│  │    ▼                         │   │
│  │  Models (models/)           │   │
│  └─────────────────────────────┘   │
└──────┬──────────────────────────────┘
       │ SQL
       ▼
┌─────────────────────────────────────┐
│      PostgreSQL (Supabase)          │
└─────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI app initialization |
| `app/config.py` | Environment settings |
| `app/core/database.py` | SQLAlchemy engine setup |
| `app/models/` | ORM models |
| `app/schemas/` | Pydantic validators |
| `app/crud/` | Database operations |
| `app/services/` | Business logic |
| `app/api/v1/endpoints/` | API routes |
| `alembic/` | Database migrations |
| `tests/` | Unit tests |

## Useful Commands

```bash
# Run server with auto-reload
uvicorn app.main:app --reload

# Run tests
pytest

# Generate database migration
alembic revision --autogenerate -m "Add new column"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Need Help?

- 📖 Read [README.md](./README.md) for detailed documentation
- 🐛 Check the Troubleshooting section in README
- 📝 Test endpoints at `http://localhost:8000/docs`

---

Happy coding! 🎉
