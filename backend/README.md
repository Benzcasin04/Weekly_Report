# WeekLog API

A production-ready FastAPI backend for the WeekLog weekly report management system. This API connects seamlessly with a Next.js frontend and uses PostgreSQL/Supabase for data persistence.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- PostgreSQL database (via Supabase)
- pip or poetry for package management

### Installation

1. **Clone and navigate to backend folder:**
```bash
cd weeklog/backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
# or
source venv/bin/activate      # macOS/Linux
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=your-project-ref
SUPABASE_PASSWORD=your-password
SUPABASE_USER=postgres
SUPABASE_PORT=5432
SUPABASE_DB=postgres
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
DEBUG=True
```

### Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Database**
4. Copy:
   - **Host** → Extract the project-ref (before `.postgres.supabase.co`)
   - **Password** → Your database password
   - Other values are pre-filled

### Running the Server

```bash
uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`

- **API Docs:** `http://localhost:8000/docs`
- **Health Check:** `http://localhost:8000/health`

## 📊 Database Setup

### Create Initial Migration

```bash
alembic revision --autogenerate -m "Initial migration"
```

### Run Migrations

```bash
alembic upgrade head
```

### Downgrade Migrations (if needed)

```bash
alembic downgrade -1
```

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Settings
│   ├── core/
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── exceptions.py    # Custom exceptions
│   │   └── security.py      # Auth utilities
│   ├── models/
│   │   └── weekly_report.py # ORM models
│   ├── schemas/
│   │   └── weekly_report.py # Pydantic schemas
│   ├── crud/
│   │   └── weekly_report.py # Database operations
│   ├── services/
│   │   └── weekly_report_service.py # Business logic
│   └── api/v1/
│       └── endpoints/
│           └── weekly_reports.py # Routes
├── alembic/                 # Database migrations
├── tests/                   # Unit tests
├── requirements.txt         # Python dependencies
└── .env.example            # Environment template
```

## 📡 API Endpoints

### Weekly Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/weekly-reports/` | List all reports (paginated) |
| POST | `/api/v1/weekly-reports/` | Create new report |
| GET | `/api/v1/weekly-reports/{id}` | Get report by ID |
| PUT | `/api/v1/weekly-reports/{id}` | Update report |
| DELETE | `/api/v1/weekly-reports/{id}` | Delete report |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## 📝 Example Requests

### Create Report
```bash
curl -X POST "http://localhost:8000/api/v1/weekly-reports/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "note": "Completed Q2 planning and team standup. Resolved 3 blockers."
  }'
```

### List Reports
```bash
curl "http://localhost:8000/api/v1/weekly-reports/?skip=0&limit=10"
```

### Get Report
```bash
curl "http://localhost:8000/api/v1/weekly-reports/{report-id}"
```

### Update Report
```bash
curl -X PUT "http://localhost:8000/api/v1/weekly-reports/{report-id}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "note": "Updated content"
  }'
```

### Delete Report
```bash
curl -X DELETE "http://localhost:8000/api/v1/weekly-reports/{report-id}"
```

## 🧪 Testing

Run tests with pytest:

```bash
pytest
```

Run with coverage:

```bash
pytest --cov=app
```

Run specific test:

```bash
pytest tests/test_weekly_reports.py::test_create_report
```

## 🔗 Frontend Integration

Update your frontend API client ([lib/api.ts](../frontend/lib/api.ts)):

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = {
  getAll: () => 
    fetch(`${API_BASE_URL}/weekly-reports`)
      .then(r => r.json()),
  
  create: (data: { name: string; note: string }) =>
    fetch(`${API_BASE_URL}/weekly-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),
  
  // ... implement other methods similarly
};
```

## 🛠️ Tech Stack

- **Framework:** FastAPI
- **ORM:** SQLAlchemy 2.0
- **Database:** PostgreSQL (via Supabase)
- **Validation:** Pydantic v2
- **Migrations:** Alembic
- **Server:** Uvicorn
- **Testing:** Pytest

## 📚 Best Practices Implemented

✅ **Layered Architecture** - Separation of concerns (routes → services → CRUD → models)
✅ **Dependency Injection** - Clean, testable code
✅ **Type Safety** - Full Pydantic + SQLAlchemy typing
✅ **Error Handling** - Custom exceptions with proper HTTP status codes
✅ **CORS Configuration** - Secure frontend communication
✅ **Database Migrations** - Alembic for version control
✅ **Environment Management** - 12-factor app principles
✅ **API Documentation** - Auto-generated Swagger UI
✅ **Unit Tests** - Comprehensive test coverage
✅ **Security** - Connection pooling, parameterized queries

## 🚨 Troubleshooting

### Database Connection Error
- Verify Supabase credentials in `.env`
- Check network connectivity to Supabase
- Ensure PostgreSQL port (5432) is open

### Migration Issues
```bash
# Reset migrations (development only)
alembic downgrade base
alembic upgrade head
```

### CORS Error
- Check `BACKEND_CORS_ORIGINS` in `.env`
- Ensure frontend URL matches exactly

### Port Already in Use
```bash
# Change port
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## 📖 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Alembic Migrations](https://alembic.sqlalchemy.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Pydantic v2](https://docs.pydantic.dev/latest/)

## 📄 License

MIT License - feel free to use this as a template for your projects!
