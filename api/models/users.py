"""
Pydantic Models for Users.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserDetails(BaseModel):
    username: str
    name: str
    email: EmailStr
    phone: str
    bio: Optional[str] = None


class UserRequest(BaseModel):
    """
    Represents a the parameters needed to create a new user
    """

    username: str
    password: str
    name: str
    email: EmailStr
    phone: str
    bio: Optional[str] = None


class UserLogin(BaseModel):
    """
    Represents a the parameters needed to create a new user
    """

    username: str
    password: str


class UserSignin(BaseModel):
    username: str
    id: int


class UserResponse(BaseModel):
    """
    Represents a user, with the password not included
    """

    id: int
    username: str
    name: str
    email: EmailStr
    phone: str


class UserWithPw(BaseModel):
    """
    Represents a user with password included
    """

    id: int
    username: str
    password: str
    name: str
    email: EmailStr
    phone: str
    bio: Optional[str] = None


class UserList(BaseModel):
    users: list[UserDetails]


class GigsForPackers(BaseModel):
    id: int
    gig_id: int
    packer_id: int
    gig_status_id: int


class GigsForPackersUpdateIn(BaseModel):
    gig_status_id: int
