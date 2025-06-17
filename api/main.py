"""
Entry point for the FastAPI Application
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, gigs, specialtys, users_packers, customer_auth
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
app.include_router(customer_auth.router)
app.include_router(gigs.router)
app.include_router(specialtys.router)
app.include_router(users_packers.router)


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

@app.get("/api/fix-table")
async def fix_table():
    """Directly fix the gigs_for_packers table issue"""
    try:
        import os
        import psycopg
        
        # Try DATABASE_PUBLIC_URL first, then DATABASE_URL
        db_url = os.environ.get("DATABASE_PUBLIC_URL") or os.environ.get("DATABASE_URL")
        if not db_url:
            return {"error": "No database URL found"}
        
        with psycopg.connect(db_url) as conn:
            with conn.cursor() as cur:
                # Check if gigs_for_mules exists
                cur.execute("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.tables 
                        WHERE table_name = 'gigs_for_mules'
                    )
                """)
                mules_exists = cur.fetchone()[0]
                
                # Check if gigs_for_packers exists
                cur.execute("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.tables 
                        WHERE table_name = 'gigs_for_packers'
                    )
                """)
                packers_exists = cur.fetchone()[0]
                
                if mules_exists and not packers_exists:
                    # Rename table and column
                    cur.execute("ALTER TABLE gigs_for_mules RENAME TO gigs_for_packers")
                    cur.execute("ALTER TABLE gigs_for_packers RENAME COLUMN mule_id TO packer_id")
                    return {"message": "Successfully renamed gigs_for_mules to gigs_for_packers"}
                elif not mules_exists and not packers_exists:
                    # Create the packers table from scratch
                    cur.execute("""
                        CREATE TABLE gigs_for_packers (
                            id SERIAL PRIMARY KEY NOT NULL,
                            gig_id INT,
                            packer_id INT,
                            gig_status_id INT DEFAULT 2,
                            FOREIGN KEY (gig_id) REFERENCES gigs(id),
                            FOREIGN KEY (packer_id) REFERENCES users(id),
                            FOREIGN KEY (gig_status_id) REFERENCES gig_status(id)
                        )
                    """)
                    return {"message": "Successfully created gigs_for_packers table"}
                elif packers_exists:
                    return {"message": "gigs_for_packers table already exists"}
                else:
                    return {"message": f"Both tables exist - mules: {mules_exists}, packers: {packers_exists}"}
                
    except Exception as e:
        return {"error": f"Table fix failed: {str(e)}"}

@app.get("/api/reset-gigs-table")
async def reset_gigs_table():
    """Delete both gigs tables to start fresh"""
    try:
        import os
        import psycopg
        
        db_url = os.environ.get("DATABASE_PUBLIC_URL") or os.environ.get("DATABASE_URL")
        if not db_url:
            return {"error": "No database URL found"}
        
        with psycopg.connect(db_url) as conn:
            with conn.cursor() as cur:
                # Drop both tables if they exist
                cur.execute("DROP TABLE IF EXISTS gigs_for_packers")
                cur.execute("DROP TABLE IF EXISTS gigs_for_mules")
                return {"message": "Successfully deleted both gigs tables"}
                
    except Exception as e:
        return {"error": f"Reset failed: {str(e)}"}

@app.get("/api/add-user-type")
async def add_user_type():
    """Directly add user_type column to users table"""
    try:
        import os
        import psycopg
        
        db_url = os.environ.get("DATABASE_PUBLIC_URL") or os.environ.get("DATABASE_URL")
        if not db_url:
            return {"error": "No database URL found"}
        
        with psycopg.connect(db_url) as conn:
            with conn.cursor() as cur:
                # Check if user_type column already exists
                cur.execute("""
                    SELECT EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'users' AND column_name = 'user_type'
                    )
                """)
                column_exists = cur.fetchone()[0]
                
                if not column_exists:
                    # Add user_type column with default value 'packer'
                    cur.execute("""
                        ALTER TABLE users 
                        ADD COLUMN user_type VARCHAR(20) NOT NULL DEFAULT 'packer'
                    """)
                    
                    # Create index for user_type
                    cur.execute("""
                        CREATE INDEX idx_users_user_type ON users(user_type)
                    """)
                    
                    return {
                        "message": "Successfully added user_type column",
                        "column_added": True
                    }
                else:
                    return {
                        "message": "user_type column already exists",
                        "column_added": False
                    }
                
    except Exception as e:
        return {"error": f"Adding user_type failed: {str(e)}"}

@app.get("/api/check-gigs-table")
async def check_gigs_table():
    """Check the contents of gigs_for_packers table"""
    try:
        import os
        import psycopg
        
        db_url = os.environ.get("DATABASE_PUBLIC_URL") or os.environ.get("DATABASE_URL")
        if not db_url:
            return {"error": "No database URL found"}
        
        with psycopg.connect(db_url) as conn:
            with conn.cursor() as cur:
                # Check table structure
                cur.execute("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'gigs_for_packers'
                    ORDER BY ordinal_position
                """)
                columns = cur.fetchall()
                
                # Check table contents
                cur.execute("SELECT COUNT(*) FROM gigs_for_packers")
                count = cur.fetchone()[0]
                
                # Get a few sample records
                cur.execute("SELECT * FROM gigs_for_packers LIMIT 5")
                sample_records = cur.fetchall()
                
                return {
                    "columns": columns,
                    "total_records": count,
                    "sample_records": sample_records
                }
                
    except Exception as e:
        return {"error": f"Check failed: {str(e)}"}

@app.post("/api/debug-booking/{gig_id}")
async def debug_booking(
    gig_id: int,
    request: Request
):
    """Debug the booking process step by step"""
    try:
        import os
        import psycopg
        from utils.authentication import try_get_jwt_user_data_from_cookie
        
        # Get user from cookie
        token = request.cookies.get("fast_api_token")
        if not token:
            return {"error": "No token found"}
        
        # Try to decode user (simplified)
        import jwt
        secret = os.environ.get("SIGNING_KEY")
        try:
            payload = jwt.decode(token, secret, algorithms=["HS256"])
            user_id = payload["user"]["id"]
        except Exception as e:
            return {"error": f"Token decode error: {str(e)}"}
        
        db_url = os.environ.get("DATABASE_PUBLIC_URL") or os.environ.get("DATABASE_URL")
        if not db_url:
            return {"error": "No database URL found"}
        
        with psycopg.connect(db_url) as conn:
            with conn.cursor() as cur:
                # Test 1: Check if gig exists
                cur.execute("SELECT id, title FROM gigs WHERE id = %s", (gig_id,))
                gig = cur.fetchone()
                
                # Test 2: Check if user exists
                cur.execute("SELECT id, username FROM users WHERE id = %s", (user_id,))
                user = cur.fetchone()
                
                # Test 3: Check gig_status table
                cur.execute("SELECT id FROM gig_status WHERE id = 2")
                status = cur.fetchone()
                
                # Test 4: Try the problematic query
                try:
                    cur.execute("""
                        SELECT * FROM gigs_for_packers 
                        WHERE gig_id = %s AND packer_id = %s
                    """, (gig_id, user_id))
                    existing = cur.fetchone()
                    query_error = None
                except Exception as e:
                    existing = None
                    query_error = str(e)
                
                # Test 5: Try inserting
                try:
                    cur.execute("""
                        INSERT INTO gigs_for_packers (gig_id, packer_id, gig_status_id)
                        VALUES (%s, %s, 2)
                        RETURNING id
                    """, (gig_id, user_id))
                    insert_result = cur.fetchone()
                    insert_error = None
                    cur.execute("ROLLBACK")  # Don't actually save
                except Exception as e:
                    insert_result = None
                    insert_error = str(e)
                
                return {
                    "user_id": user_id,
                    "gig_id": gig_id,
                    "gig_exists": gig,
                    "user_exists": user,
                    "status_2_exists": status,
                    "existing_assignment": existing,
                    "query_error": query_error,
                    "insert_test": insert_result,
                    "insert_error": insert_error
                }
        
    except Exception as e:
        return {"error": f"Debug failed: {str(e)}"}

@app.get("/api/reset-all-gig-tables")
async def reset_all_gig_tables():
    """Drop all gig-related tables and recreate fresh gigs_for_packers table"""
    try:
        import os
        import psycopg
        
        db_url = os.environ.get("DATABASE_PUBLIC_URL") or os.environ.get("DATABASE_URL")
        if not db_url:
            return {"error": "No database URL found"}
        
        with psycopg.connect(db_url) as conn:
            with conn.cursor() as cur:
                # Drop all the problematic tables
                cur.execute("DROP TABLE IF EXISTS gigs_for_packers CASCADE")
                cur.execute("DROP TABLE IF EXISTS gigs_for_mules CASCADE")
                
                # Recreate gigs_for_packers table fresh
                cur.execute("""
                    CREATE TABLE gigs_for_packers (
                        id SERIAL PRIMARY KEY NOT NULL,
                        gig_id INT NOT NULL,
                        packer_id INT NOT NULL,
                        gig_status_id INT DEFAULT 2,
                        FOREIGN KEY (gig_id) REFERENCES gigs(id) ON DELETE CASCADE,
                        FOREIGN KEY (packer_id) REFERENCES users(id) ON DELETE CASCADE,
                        FOREIGN KEY (gig_status_id) REFERENCES gig_status(id)
                    )
                """)
                
                # Check if gig_status table has the default status (2)
                cur.execute("SELECT COUNT(*) FROM gig_status WHERE id = 2")
                status_count = cur.fetchone()[0]
                
                if status_count == 0:
                    # Insert basic gig statuses if they don't exist
                    cur.execute("""
                        INSERT INTO gig_status (id, status) 
                        VALUES 
                            (1, 'pending'),
                            (2, 'booked'),
                            (3, 'completed')
                        ON CONFLICT (id) DO NOTHING
                    """)
                
                return {
                    "message": "Successfully reset all gig tables",
                    "created_table": "gigs_for_packers",
                    "status_records_existed": status_count > 0,
                    "status_records_created": status_count == 0
                }
                
    except Exception as e:
        return {"error": f"Reset failed: {str(e)}"}
