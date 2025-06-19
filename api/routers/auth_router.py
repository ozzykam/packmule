"""
User Authentication API Router
"""

from fastapi import (
    Depends,
    Request,
    Response,
    HTTPException,
    status,
    APIRouter,
)
from queries.user_queries import UserQueries
from utils.exceptions import UserDatabaseException
from models.users import (
    UserRequest,
    UserResponse,
    UserLogin,
    UserDetails,
    UserSignin,
)

from utils.authentication import (
    try_get_jwt_user_data,
    hash_password,
    generate_jwt,
    verify_password,
)

# Note we are using a prefix here,
# This saves us typing in all the routes below
router = APIRouter(tags=["Authentication"], prefix="/api/auth")
not_logged = HTTPException(status_code=204, detail="Not logged in")


@router.post("/signup")
async def signup(
    new_user: UserRequest,
    request: Request,
    response: Response,
    queries: UserQueries = Depends(),
) -> UserDetails:
    """
    Creates a new user when someone submits the signup form
    """

    # Hash the password the user sent us
    hashed_password = hash_password(new_user.password)

    # Create the user in the database
    try:
        user = queries.create_user(new_user, hashed_password)
    except UserDatabaseException as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    # Generate a JWT token
    token = generate_jwt(user)

    # Convert the UserWithPW to a UserOut
    user_out = UserResponse(**user.model_dump())

    # Secure cookies for HTTPS (production)
    secure = request.headers.get("origin") != "http://localhost:5173"

    # Set a cookie with the token in it
    response.set_cookie(
        key="fast_api_token",
        value=token,
        httponly=True,
        samesite="none",
        secure=secure,
    )
    return user_out


@router.post("/signin")
async def signin(
    user_request: UserLogin,
    request: Request,
    response: Response,
    queries: UserQueries = Depends(),
) -> UserSignin:
    """
    Signs the user in when they use the Sign In form (accepts all user types)
    """

    # Try to get the user from the database
    user = queries.get_by_username(user_request.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    # Verify this is a packer account
    if user.user_type != "packer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account is not a packer account. Please use the customer login.",
        )

    # Verify the user's password
    if not verify_password(user_request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    # Generate a JWT token
    token = generate_jwt(user)

    # Secure cookies for HTTPS (production)
    secure = request.headers.get("origin") != "http://localhost:5173"

    # Set a cookie with the token in it
    response.set_cookie(
        key="fast_api_token",
        value=token,
        httponly=True,
        samesite="none",
        secure=secure,
    )

    # Convert the UserWithPW to a UserOut
    return UserSignin(
        id=user.id,
        username=user.username,
        user_type=user.user_type,
    )


@router.get("/authenticate")
async def authenticate(
    user: UserSignin = Depends(try_get_jwt_user_data),
    queries: UserQueries = Depends(),
) -> UserSignin | None:
    """
    This function returns the user if the user is logged in.

    The `try_get_jwt_user_data` function tries to get the user and validate
    the JWT

    If the user isn't logged in this returns a 404

    This can be used in your frontend to determine if a user
    is logged in or not
    """
    if not user:
        return None
    
    # Get full user details to return complete info including user_type
    full_user = queries.get_by_id(user.id)
    if not full_user:
        return None
        
    return UserSignin(
        id=full_user.id,
        username=full_user.username,
        user_type=full_user.user_type,
    )


@router.delete("/signout")
async def signout(
    request: Request,
    response: Response,
):
    """
    Signs the user out by deleting their JWT Cookie
    """
    # Secure cookies for HTTPS (production)
    secure = request.headers.get("origin") != "http://localhost:5173"

    # Delete the cookie
    response.delete_cookie(
        key="fast_api_token", httponly=True, samesite="none", secure=secure
    )

    # There's no need to return anything in the response.
    # All that has to happen is the cookie header must come back
    # Which causes the browser to delete the cookie
    return
