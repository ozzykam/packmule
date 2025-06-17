"""
Pydantic Models for Users.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

# User type options
UserType = Literal["packer", "customer"]


class UserDetails(BaseModel):
    username: str
    name: str
    email: EmailStr
    phone: str
    bio: Optional[str] = None
    user_type: UserType


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
    user_type: UserType = "packer"  # Default to packer for backward compatibility


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
    user_type: UserType


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
    user_type: UserType


class UserList(BaseModel):
    users: list[UserDetails]


class GigsForPackers(BaseModel):
    id: int
    gig_id: int
    packer_id: int
    gig_status_id: int


class GigsForPackersUpdateIn(BaseModel):
    gig_status_id: int


# Customer-specific models
class CustomerRequest(BaseModel):
    """
    Represents the parameters needed to create a new customer
    """
    username: str
    password: str
    name: str
    email: EmailStr
    phone: str
    bio: Optional[str] = None
    user_type: UserType = "customer"


class CustomerResponse(BaseModel):
    """
    Represents a customer user response
    """
    id: int
    username: str
    name: str
    email: EmailStr
    phone: str
    bio: Optional[str] = None
    user_type: UserType
