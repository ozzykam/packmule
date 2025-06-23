from psycopg.rows import class_row
from fastapi import HTTPException
from typing import List
from models.specialtys import (
    SpecialtyIn,
    SpecialtyOut,
    PackerSpecialtyOut,
    GigSpecialtyOut,
)
from queries.pool import pool


class SpecialtyQueries:
    def get_all_specialtys(self) -> List[SpecialtyOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as specialtys_db:
                    specialtys_db.execute(
                        """
                        SELECT *
                        FROM specialties
                        ORDER BY id;
                        """
                    )
                    return [
                        SpecialtyOut(
                            id=record[0],
                            name=record[1],
                            description=record[2],
                            specialty_type_id=record[3],
                        )
                        for record in specialtys_db
                    ]

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="Could not retrieve all specialties"
            )

    def create_specialty(self, specialty: SpecialtyIn) -> SpecialtyOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as specialty_db:
                    result = specialty_db.execute(
                        """
                        INSERT INTO specialties
                        (
                            name,
                            specialty_type_id,
                            description
                        )
                        VALUES
                            (%s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            specialty.name,
                            specialty.specialty_type_id,
                            specialty.description,
                        ],
                    )
                    id = result.fetchone()[0]

                    old_data = specialty.model_dump()
                    return SpecialtyOut(id=id, **old_data)
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="Could not create new specialty"
            )

    def get_specialty_by_id(self, specialty_id: int) -> SpecialtyOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as specialty_db:
                    specialty = specialty_db.execute(
                        """
                        SELECT *
                        FROM specialties
                        WHERE id = %s
                        """,
                        [specialty_id],
                    )
                    record = specialty.fetchone()
                    if record is None:
                        return None
                    return SpecialtyOut(
                        id=record[0],
                        name=record[1],
                        description=record[2],
                        specialty_type_id=record[3],
                    )
        except Exception as e:
            print(f"Error fetching specialty {specialty_id}: {e}")
            return None

    def create_packer_specialty(
        self,
        user_id: int,
        specialty_id: int,
        specialty_type_id: int,
        specialty_name: str,
    ) -> PackerSpecialtyOut:
        try:
            with pool.connection() as conn:
                with conn.cursor(
                    row_factory=class_row(PackerSpecialtyOut)
                ) as cur:
                    cur.execute(
                        """
                        INSERT INTO user_specialties (
                            user_id,
                            specialty_id,
                            specialty_type_id,
                            specialty_name
                        )
                        VALUES (%s, %s, %s, %s )
                        RETURNING
                            id,
                            user_id,
                            specialty_id,
                            specialty_type_id,
                            specialty_name;
                        """,
                        (
                            user_id,
                            specialty_id,
                            specialty_type_id,
                            specialty_name,
                        ),
                    )
                    packer_special = cur.fetchone()
                    if not packer_special:
                        raise HTTPException(
                            status_code=404, detail="Specialty not found"
                        )
                    return packer_special
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=401, detail="Could not create packer specialty"
            )

    def get_packer_specialty_by_id(
        self, user_id: int, specialty_id: int
    ) -> PackerSpecialtyOut:
        with pool.connection() as conn:
            with conn.cursor() as packer_specialty_db:
                specialty = packer_specialty_db.execute(
                    """
                    SELECT
                        us.id,
                        us.user_id,
                        us.specialty_id,
                        s.specialty_type_id
                    FROM
                        user_specialties us
                    JOIN
                        specialties s ON us.specialty_id = s.id
                    WHERE
                        us.user_id = %s AND us.specialty_id = %s
                    """,
                    (
                        user_id,
                        specialty_id,
                    ),
                )
                record = specialty.fetchone()
                if record is None:
                    return None
                return PackerSpecialtyOut(
                    id=record[0],
                    user_id=record[1],
                    specialty_id=record[2],
                    specialty_type_id=record[3],
                )

    def delete_packer_specialty(self, user_id: int, specialty_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as packer_specialty_db:
                    packer_specialty_db.execute(
                        """
                        DELETE FROM user_specialties
                        WHERE user_id = %s AND specialty_id = %s
                        """,
                        (user_id, specialty_id),
                    )
                    return True
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=401, detail="Could not delete packer specialty"
            )

    def get_all_specialties_by_packer(
        self, user_id: int
    ) -> List[PackerSpecialtyOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as packer_specialtys_db:
                    record = packer_specialtys_db.execute(
                        """
                        SELECT
                            us.id,
                            us.user_id,
                            us.specialty_id,
                            s.specialty_type_id,
                            s.name
                        FROM
                            user_specialties us
                        JOIN
                            specialties s ON us.specialty_id = s.id
                        WHERE us.user_id = %s
                        """,
                        [user_id],
                    )
                    if record is None:
                        return []
                    return [
                        PackerSpecialtyOut(
                            id=record[0],
                            user_id=record[1],
                            specialty_id=record[2],
                            specialty_type_id=record[3],
                            specialty_name=record[4],
                        )
                        for record in packer_specialtys_db
                    ]
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=401,
                detail="Could not retrieve all packer specialties",
            )

    def get_gig_specialty_by_id(
        self, gig_id: int, specialty_id: int
    ) -> GigSpecialtyOut:
        with pool.connection() as conn:
            with conn.cursor() as gig_specialty_db:
                specialty = gig_specialty_db.execute(
                    """
                    SELECT
                        gs.id,
                        gs.gig_id,
                        gs.specialty_id,
                        s.name,
                        s.specialty_type_id
                    FROM
                        gig_specialties gs
                    JOIN
                        specialties s ON gs.specialty_id = s.id
                    WHERE
                        gs.gig_id = %s AND gs.specialty_id = %s
                    """,
                    (
                        gig_id,
                        specialty_id,
                    ),
                )
                record = specialty.fetchone()
                if record is None:
                    return None
                return GigSpecialtyOut(
                    id=record[0],
                    gig_id=record[1],
                    specialty_id=record[2],
                    specialty_name=record[3],
                    specialty_type_id=record[4],
                )

    def create_gig_specialty(
        self,
        gig_id: int,
        specialty_id: int,
        specialty_name: str,
        specialty_type_id: int,
    ) -> GigSpecialtyOut:
        try:
            with pool.connection() as conn:
                with conn.cursor(
                    row_factory=class_row(GigSpecialtyOut)
                ) as cur:
                    cur.execute(
                        """
                        INSERT INTO gig_specialties (
                            gig_id,
                            specialty_id,
                            specialty_name,
                            specialty_type_id
                        )
                        VALUES (%s, %s, %s, %s)
                        RETURNING id, gig_id, specialty_id,
                        specialty_name, specialty_type_id;
                        """,
                        (
                            gig_id,
                            specialty_id,
                            specialty_name,
                            specialty_type_id,
                        ),
                    )
                    gig_special = cur.fetchone()
                    if not gig_special:
                        raise HTTPException(
                            status_code=404, detail="Specialty not found"
                        )
                    return gig_special
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=401, detail="Could not create gig specialty"
            )

    def get_all_specialties_by_gig(self, gig_id: int) -> List[GigSpecialtyOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gig_specialty_db:
                    gig_specialty_db.execute(
                        """
                        SELECT
                            gs.id,
                            gs.gig_id,
                            gs.specialty_id,
                            s.name,
                            s.specialty_type_id
                        FROM
                            gig_specialties gs
                        JOIN
                            specialties s ON gs.specialty_id = s.id
                        WHERE
                            gs.gig_id = %s
                        """,
                        [gig_id],
                    )
                    return [
                        GigSpecialtyOut(
                            id=record[0],
                            gig_id=record[1],
                            specialty_id=record[2],
                            specialty_name=record[3],
                            specialty_type_id=record[4],
                        )
                        for record in gig_specialty_db
                    ]
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=401,
                detail="Could not retrieve all gig specialties",
            )

    def delete_gig_specialty(self, gig_id: int, specialty_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gig_specialty_db:
                    gig_specialty_db.execute(
                        """
                        DELETE FROM gig_specialties
                        WHERE gig_id = %s AND specialty_id = %s
                        """,
                        (gig_id, specialty_id),
                    )
                    return True
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=401, detail="Could not delete gig specialty"
            )
