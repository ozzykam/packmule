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
        "https://packmulepro.com",
        "https://packmule-650ce.web.app",  # Keep old domain for backup
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
