"""
Helper functions for implementing authentication
"""

import os
import bcrypt
from calendar import timegm
from datetime import datetime, timedelta
from fastapi import Cookie
from jose import JWTError, jwt
from jose.constants import ALGORITHMS
from typing import Annotated, Optional
from models.jwt import JWTPayload, JWTUserData

from queries.user_queries import UserWithPw

# If you ever need to change the hashing algorith, you can change it here
ALGORITHM = ALGORITHMS.HS256

# We pull this from the environment
SIGNING_KEY = os.environ.get("SIGNING_KEY")
if not SIGNING_KEY:
    raise ValueError("SIGNING_KEY environment variable not set")


async def decode_jwt(token: str) -> Optional[JWTPayload]:
    """
    Helper function to decode the JWT from a token string
    """
    try:
        payload = jwt.decode(token, SIGNING_KEY, algorithms=[ALGORITHM])
        return JWTPayload(**payload)
    except (JWTError, AttributeError) as e:
        print(e)
    return None


async def try_get_jwt_user_data(
    fast_api_token: Annotated[str | None, Cookie()] = None,
) -> Optional[JWTUserData]:
    """
    This function can be dependency injected into a route

    It checks the JWT token from the cookie and attempts to get the user
    from the payload of the JWT

    *NOTE* this does not get the user from the database, if you
    need to do that you must call another method after calling this

    Returns None when the user isn't logged in

    Example usage:

    ```python
    @app.get("/some-protected-route"):
    def some_protected_route(user: Depends(try_get_user_data)):
        if not user:
            # Do somthing when not logged in
        else:
            # Do something when logged in
    ```
    """
    # If there's no cookie at all, return None
    if not fast_api_token:
        return

    # If the payload doesn't exist, return None
    payload = await decode_jwt(fast_api_token)
    if not payload:
        return

    return payload.user


def verify_password(plain_password, hashed_password) -> bool:
    """
    This verifies the user's password, by hashing the plain
    password and then comparing it to the hashed password
    from the database
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def hash_password(plain_password) -> str:
    """
    Helper function that hashes a password
    """
    return bcrypt.hashpw(
        plain_password.encode("utf-8"), bcrypt.gensalt()
    ).decode()


def generate_jwt(user: UserWithPw) -> str:
    """
    Generates a new JWT token using the user's information

    We store the user as a JWTUserData converted to a dictionary
    in the payload of the JWT
    """
    exp = timegm((datetime.utcnow() + timedelta(hours=1)).utctimetuple())
    jwt_data = JWTPayload(
        exp=exp,
        sub=user.username,
        user=JWTUserData(username=user.username, id=user.id),
    )
    encoded_jwt = jwt.encode(
        jwt_data.model_dump(), SIGNING_KEY, algorithm=ALGORITHMS.HS256
    )
    return encoded_jwt
