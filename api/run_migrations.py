import asyncio
import os
import sys

async def run_migrations():
    # Add the current directory to Python path
    sys.path.insert(0, '/app')
    
    # Import migrations
    from migrations import up, LATEST
    
    # Get database URL from environment
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found in environment variables")
        return
    
    print(f"Running migrations with DATABASE_URL: {db_url[:50]}...")
    
    try:
        await up(db_url, to=LATEST)
        print("Migrations completed successfully!")
    except Exception as e:
        print(f"Migration failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(run_migrations())