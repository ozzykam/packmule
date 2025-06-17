"""
Database Queries for Users
"""

import os
import psycopg
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
from typing import Optional
from models.users import UserDetails, UserWithPw, UserRequest
from utils.exceptions import UserDatabaseException

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(DATABASE_URL)


class UserQueries:
    """
    Class containing queries for the Users table

    Can be dependency injected into a route like so

    def my_route(userQueries: UserQueries = Depends()):
        # Here you can call any of the functions to query the DB
    """

    def get_by_username(self, username: str) -> Optional[UserWithPw]:
        """
        Gets a user from the database by username

        Returns None if the user isn't found
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserWithPw)) as cur:
                    cur.execute(
                        """
                            SELECT
                                *
                            FROM users
                            WHERE username = %s
                            """,
                        [username],
                    )
                    user = cur.fetchone()
                    if not user:
                        return None
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException(f"Error getting user {username}")
        return user

    def get_by_id(self, id: int) -> Optional[UserWithPw]:
        """
        Gets a user from the database by user id

        Returns None if the user isn't found
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserWithPw)) as cur:
                    cur.execute(
                        """
                            SELECT
                                *
                            FROM users
                            WHERE id = %s
                            """,
                        [id],
                    )
                    user = cur.fetchone()
                    if not user:
                        return None
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException(f"Error getting user with id {id}")
        return user

    def create_user(
        self, new_user: UserRequest, hashed_password: str
    ) -> UserWithPw:
        """
        Creates a new user in the database
        Raises a UserInsertionException if creating the user fails
        """
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserWithPw)) as cur:
                    cur.execute(
                        """
                        INSERT INTO users (
                            username,
                            password,
                            name,
                            email,
                            phone,
                            bio,
                            user_type
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s
                        )
                        RETURNING *;
                        """,
                        [
                            new_user.username,
                            hashed_password,
                            new_user.name,
                            new_user.email,
                            new_user.phone,
                            new_user.bio,
                            new_user.user_type,
                        ],
                    )
                    user = cur.fetchone()
                    if not user:
                        raise UserDatabaseException(
                            f"Could not create user"
                            f" with username {new_user.username}"
                        )
        except psycopg.Error:
            raise UserDatabaseException(
                f"Could not create user with username {new_user.username}"
            )
        return user

    def edit_user_profile(
        self, user_id: int, edit_user: UserDetails
    ) -> Optional[UserWithPw]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(UserWithPw)) as cur:
                    cur.execute(
                        """
                        UPDATE users
                        SET username = %s,
                            name = %s,
                            email = %s,
                            phone = %s,
                            bio = %s,
                            user_type = %s
                        WHERE id = %s
                        RETURNING *;
                        """,
                        [
                            edit_user.username,
                            edit_user.name,
                            edit_user.email,
                            edit_user.phone,
                            edit_user.bio,
                            edit_user.user_type,
                            user_id,
                        ],
                    )
                    user = cur.fetchone()
                    if not user:
                        return None
        except psycopg.Error:
            raise UserDatabaseException("Error updating user")
        return user
