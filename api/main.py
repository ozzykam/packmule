"""
Entry point for the FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, gigs, specialtys, users_mules
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://packmule-650ce.web.app",
        "http://localhost:5173",
        os.environ.get("CORS_HOST", "http://localhost:5173")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(gigs.router)
app.include_router(specialtys.router)
app.include_router(users_mules.router)


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00",
        }
    }

@app.get("/api/test-db")
async def test_database():
    """Test database connection"""
    import os
    
    try:
        db_url = os.environ.get("DATABASE_URL")
        public_db_url = os.environ.get("DATABASE_PUBLIC_URL")
        
        return {
            "DATABASE_URL": db_url[:50] + "..." if db_url else "Not set",
            "DATABASE_PUBLIC_URL": public_db_url[:50] + "..." if public_db_url else "Not set",
            "message": "Database URLs retrieved"
        }
    except Exception as e:
        return {"error": f"Error: {str(e)}"}

@app.get("/api/run-migrations")
async def run_migrations():
    """Temporary endpoint to run database migrations"""
    try:
        import sys
        sys.path.insert(0, '/app')
        from migrations import up, LATEST
        import os
        
        # Try DATABASE_PUBLIC_URL first, then DATABASE_URL
        db_url = os.environ.get("DATABASE_PUBLIC_URL") or os.environ.get("DATABASE_URL")
        if not db_url:
            return {"error": "No database URL found"}
        
        await up(db_url, to=LATEST)
        return {"message": "Migrations completed successfully"}
    except Exception as e:
        return {"error": f"Migration failed: {str(e)}"}
