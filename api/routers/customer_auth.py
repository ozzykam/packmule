"""
Customer Authentication API Router
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
    CustomerRequest,
    CustomerResponse,
    UserLogin,
    UserSignin,
)

from utils.authentication import (
    try_get_jwt_user_data,
    hash_password,
    generate_jwt,
    verify_password,
)

# Customer-specific authentication router
router = APIRouter(tags=["Customer Authentication"], prefix="/api/customer/auth")
not_logged = HTTPException(status_code=204, detail="Not logged in")


@router.post("/signup")
async def customer_signup(
    new_customer: CustomerRequest,
    request: Request,
    response: Response,
    queries: UserQueries = Depends(),
) -> CustomerResponse:
    """
    Creates a new customer when someone submits the customer signup form
    """

    # Hash the password the customer sent us
    hashed_password = hash_password(new_customer.password)

    # Create the customer in the database
    try:
        user = queries.create_user(new_customer, hashed_password)
    except UserDatabaseException as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    # Generate a JWT token
    token = generate_jwt(user)

    # Convert the UserWithPW to a CustomerResponse
    customer_out = CustomerResponse(**user.model_dump())

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
    return customer_out


@router.post("/signin")
async def customer_signin(
    user_request: UserLogin,
    request: Request,
    response: Response,
    queries: UserQueries = Depends(),
) -> UserSignin:
    """
    Signs the customer in when they use the Customer Sign In form
    """

    # Try to get the user from the database
    user = queries.get_by_username(user_request.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    # Verify this is a customer account
    if user.user_type != "customer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account is not a customer account. Please use the packer login.",
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
    )


@router.get("/authenticate")
async def authenticate_customer(
    user: UserSignin = Depends(try_get_jwt_user_data),
) -> UserSignin | None:
    """
    This function returns the customer if the customer is logged in.
    Only works for customer accounts.
    """
    if not user:
        return None
    
    # Get full user details to check user type
    user_queries = UserQueries()
    full_user = user_queries.get_by_id(user.id)
    
    if not full_user or full_user.user_type != "customer":
        return None
        
    return user


@router.delete("/signout")
async def customer_signout(
    request: Request,
    response: Response,
):
    """
    Signs the customer out by deleting their JWT Cookie
    """
    # Secure cookies for HTTPS (production)
    secure = request.headers.get("origin") != "http://localhost:5173"

    # Delete the cookie
    response.delete_cookie(
        key="fast_api_token", httponly=True, samesite="none", secure=secure
    )

    return