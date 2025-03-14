"""
Pydantic Models for the JWT Payload
"""

from pydantic import BaseModel


class JWTUserData(BaseModel):
    """
    Represents the user data we store in the JWT itself
    It's important to store the id so we can make DB calls
    without looking up the id in the users table
    """

    id: int
    username: str


# This represents the payload stored inside the JWT
class JWTPayload(BaseModel):
    """
    The payload of the JWT
    """

    user: JWTUserData
    sub: str
    exp: int
