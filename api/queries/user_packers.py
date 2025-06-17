"""
Database Queries for Users as Packers
"""

import os
from typing import List
import psycopg
from psycopg_pool import ConnectionPool
from psycopg.rows import class_row
from typing import Optional
from fastapi import HTTPException
from models.users import UserWithPw, UserRequest, UserDetails
from utils.exceptions import UserDatabaseException

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(DATABASE_URL)


class PackerQueries:
    """
    Class containing queries for the Users table

    Can be dependency injected into a route like so

    def my_route(userQueries: UserQueries = Depends()):
        # Here you can call any of the functions to query the DB
    """

    def get_all_packers(self) -> List[UserDetails]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as packer_db:
                    packer_db.execute(
                        """
                        SELECT id, username, name, email, phone, bio
                        FROM users
                        ORDER BY id;
                        """
                    )

                    return [
                        UserDetails(
                            id=packer[0],
                            username=packer[1],
                            name=packer[2],
                            email=packer[3],
                            phone=packer[4],
                            bio=packer[5],
                        )
                        for packer in packer_db
                    ]

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="could not retrieve all packers"
            )

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

    def create_packer(
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
                            bio
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s
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
                        ],
                    )
                    user = cur.fetchone()
                    if not user:
                        raise UserDatabaseException(
                            f"Could not create user "
                            f"with username {new_user.username}"
                        )
        except psycopg.Error:
            raise UserDatabaseException(
                f"Could not create user with username {new_user.username}"
            )
        return user

    def edit_packer_profile(
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
                            bio = %s
                        WHERE id = %s
                        RETURNING *;
                        """,
                        [
                            edit_user.username,
                            edit_user.name,
                            edit_user.email,
                            edit_user.phone,
                            edit_user.bio,
                            user_id,
                        ],
                    )
                    user = cur.fetchone()
                    if not user:
                        return None
        except psycopg.Error:
            raise UserDatabaseException("Error updating user")
        return user
