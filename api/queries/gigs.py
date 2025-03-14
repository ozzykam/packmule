import psycopg
from fastapi import HTTPException
from typing import List, Optional
from models.gigs import GigIn, GigInWithStatus, GigOut
from models.users import GigsForMules, GigsForMulesUpdateIn
from utils.exceptions import UserDatabaseException
from queries.pool import pool
from psycopg.types.json import Json
from psycopg.rows import class_row


class Error(BaseException):
    message: str


class GigQueries:
    def get_all_gigs(self) -> List[GigOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gig_db:
                    gig_db.execute(
                        """
                        SELECT *
                        FROM gigs
                        ORDER BY id;
                        """
                    )

                    return [
                        GigOut(
                            id=gig[0],
                            title=gig[1],
                            price=gig[2],
                            boxes=gig[3],
                            description=gig[4],
                            pickup_location=gig[5],
                            pickup_date=gig[6],
                            dropoff_location=gig[7],
                            dropoff_date=gig[8],
                            created_on_date=gig[9],
                        )
                        for gig in gig_db
                    ]
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="Could not retrieve list of Gigs"
            )

    def create_gig(self, gig: GigIn) -> GigOut:

        # connect to the database
        with pool.connection() as conn:
            # get a cursor
            with conn.cursor() as gig_db:
                pickup_location = Json(gig.pickup_location.model_dump())
                dropoff_location = Json(gig.dropoff_location.model_dump())
                # Run our INSERT statement
                result = gig_db.execute(
                    """
                        INSERT INTO gigs
                            (
                                title,
                                price,
                                boxes,
                                description,
                                pickup_location,
                                pickup_date,
                                dropoff_location,
                                dropoff_date,
                                created_on_date
                            )
                        VALUES
                            (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING id;
                        """,
                    [
                        gig.title,
                        gig.price,
                        gig.boxes,
                        gig.description,
                        pickup_location,
                        gig.pickup_date,
                        dropoff_location,
                        gig.dropoff_date,
                        gig.created_on_date,
                    ],
                )
                id = result.fetchone()[0]
                # Return new Data
                old_data = gig.model_dump()
                return GigOut(id=id, **old_data)

    def delete(self, gig_id: int):
        try:
            with pool.connection() as conn:
                with conn.cursor() as gig_db:
                    gig_db.execute(
                        """
                        DELETE FROM gigs
                        WHERE id = %s
                        """,
                        (gig_id,),
                    )
                    return True
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500,
                detail="Could not retrieve and update requested Gig",
            )

    def update_gig(self, gig_id: int, gig: GigIn) -> GigOut:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gig_db:
                    pickup_location = Json(gig.pickup_location.model_dump())
                    dropoff_location = Json(gig.dropoff_location.model_dump())

                    gig_db.execute(
                        """
                        UPDATE gigs
                        SET title = %s
                            , price = %s
                            , boxes = %s
                            , description = %s
                            , pickup_location = %s
                            , pickup_date = %s
                            , dropoff_location = %s
                            , dropoff_date = %s
                            , created_on_date = %s
                        WHERE id = %s
                        """,
                        [
                            gig.title,
                            gig.price,
                            gig.boxes,
                            gig.description,
                            pickup_location,
                            gig.pickup_date,
                            dropoff_location,
                            gig.dropoff_date,
                            gig.created_on_date,
                            gig_id,
                        ],
                    )
                    old_data = gig.model_dump()
                    return GigOut(id=gig_id, **old_data)
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500,
                detail="Could not retrieve and update requested Gig",
            )

    def get_gig_by_id(self, gig_id: int) -> Optional[GigOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT *
                        FROM gigs
                        WHERE id = %s
                        """,
                        [gig_id],
                    )
                    record = result.fetchone()
                    return self.record_to_gig_out(record)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail="Unable to find Gig")

    def gig_in_to_out(self, id: int, gig: GigIn):
        old_data = gig.model_dump()
        return GigOut(id=id, **old_data)

    def record_to_gig_out(self, record):
        return GigOut(
            id=record[0],
            title=record[1],
            price=record[2],
            boxes=record[3],
            description=record[4],
            pickup_location=record[5],
            pickup_date=record[6],
            dropoff_location=record[7],
            dropoff_date=record[8],
            created_on_date=record[9],
        )

    def add_gig_to_mule(self, gig_id: int, mule_id: int) -> GigsForMules:
        try:
            with pool.connection() as conn:
                with conn.cursor(
                    row_factory=class_row(GigsForMules)
                ) as gfm_db:
                    gfm_db.execute(
                        """
                        INSERT INTO gigs_for_mules (
                            gig_id,
                            mule_id
                        )
                        VALUES (%s, %s)
                        RETURNING id, gig_id, mule_id, gig_status_id
                        """,
                        (gig_id, mule_id),
                    )
                    gig_for_mule = gfm_db.fetchone()
                    if not gig_for_mule:
                        raise HTTPException(
                            status_code=404, detail="could not add gig to mule"
                        )
                    return gig_for_mule
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="database error - check for typos"
            )

    def get_all_gigs_for_mules(self) -> List[GigsForMules]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gig_db:
                    gig_db.execute(
                        """
                        SELECT *
                        FROM gigs_for_mules
                        ORDER BY id;
                        """
                    )
                    return [
                        GigsForMules(
                            id=gig[0],
                            gig_id=gig[1],
                            mule_id=gig[2],
                            gig_status_id=gig[3],
                        )
                        for gig in gig_db
                    ]
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="Could not retrieve list of Gigs"
            )

    def get_gig_for_mule_by_id(
        self, mule_id: int, gig_id: int
    ) -> GigsForMules:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gfm_db:
                    gfm_db.execute(
                        """
                        SELECT *
                        FROM gigs_for_mules
                        WHERE gig_id = %s AND mule_id = %s
                        """,
                        (gig_id, mule_id),
                    )
                    record = gfm_db.fetchone()
                    if not record:
                        return None
                    return GigsForMules(
                        id=record[0],
                        gig_id=record[1],
                        mule_id=record[2],
                        gig_status_id=record[3],
                    )
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="Incorrect Gig or Mule ID provided"
            )

    def get_all_gigs_for_mule_by_id_for_status(
            self,
            mule_id: int
    ) -> List[GigsForMules]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gfm_db:
                    gfm_db.execute(
                        """
                        SELECT *
                        FROM gigs_for_mules gfm
                        JOIN gigs g ON g.id = gfm.gig_id
                        WHERE gfm.mule_id = %s
                        """,
                        (mule_id,),
                    )
                    records = gfm_db.fetchall()
                    if not records:
                        return None
                    return [
                        GigsForMules(
                            id=record[0],
                            gig_id=record[1],
                            mule_id=record[2],
                            gig_status_id=record[3]
                        )
                        for record in records
                    ]

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="Incorrect Gig or Mule ID provided"
            )

    def get_all_gigs_for_mule_by_id(self, mule_id: int) -> List[GigOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gfm_db:
                    gfm_db.execute(
                        """
                        SELECT *
                        FROM gigs g
                        JOIN gigs_for_mules gfm ON g.id = gfm.gig_id
                        WHERE gfm.mule_id = %s
                        """,
                        (mule_id,),
                    )
                    records = gfm_db.fetchall()
                    if not records:
                        return None
                    return [
                        GigOut(
                            id=record[0],
                            title=record[1],
                            price=record[2],
                            boxes=record[3],
                            description=record[4],
                            pickup_location=record[5],
                            pickup_date=record[6],
                            dropoff_location=record[7],
                            dropoff_date=record[8],
                            created_on_date=record[9],
                        )
                        for record in records
                    ]

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="Incorrect Gig or Mule ID provided"
            )

    def get_booked_gigs_for_mule_by_id(self, mule_id: int) -> List[GigOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gfm_db:
                    gfm_db.execute(
                        """
                        SELECT *
                        FROM gigs g
                        JOIN gigs_for_mules gfm ON g.id = gfm.gig_id
                        WHERE gfm.mule_id = %s AND gfm.gig_status_id = 2;
                        """,
                        (mule_id,),
                    )
                    records = gfm_db.fetchall()
                    if not records:
                        return None
                    return [
                        GigOut(
                            id=record[0],
                            title=record[1],
                            price=record[2],
                            boxes=record[3],
                            description=record[4],
                            pickup_location=record[5],
                            pickup_date=record[6],
                            dropoff_location=record[7],
                            dropoff_date=record[8],
                            created_on_date=record[9],
                        )
                        for record in records
                    ]

        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="Incorrect Gig or Mule ID provided"
            )

    def delete_mule_from_gig(self, mule_id: int, gig_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gig_for_mule_db:
                    gig_for_mule_db.execute(
                        """
                        DELETE FROM gigs_for_mules
                        WHERE mule_id = %s AND gig_id = %s
                        """,
                        (mule_id, gig_id),
                    )
                    return True
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=401, detail="Could not remove Mule from Gig"
            )

    def update_gig_for_mule(
            self,
            gig_for_mule_id: int,
            edit_gig_for_mule: GigsForMulesUpdateIn
    ) -> Optional[GigsForMules]:
        print(edit_gig_for_mule)
        try:
            with pool.connection() as conn:
                with conn.cursor(
                    row_factory=class_row(GigsForMules)
                ) as cur:
                    cur.execute(
                        """
                        UPDATE gigs_for_mules
                        SET gig_status_id= %s
                        WHERE id = %s
                        RETURNING *;
                        """,
                        [
                            edit_gig_for_mule.gig_status_id,
                            gig_for_mule_id
                        ]
                    )
                    gig = cur.fetchone()
                    if not gig:
                        return None
                    return gig
        except psycopg.Error as e:
            print(e)
            raise UserDatabaseException(
                "Error in updating Gig for Mule"
            )

    def get_gigs_for_mule_with_status(
            self,
            mule_id: int
    ) -> List[GigInWithStatus]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as gig_db:
                    gig_db.execute(
                        """
                        SELECT g.*, gm.gig_status_id, gm.mule_id
                        FROM gigs g
                        JOIN gigs_for_mules gm ON g.id = gm.gig_id
                        WHERE gm.mule_id = %s
                        """,
                        [mule_id],
                    )
                    return [
                        GigInWithStatus(
                            id=gig[0],
                            title=gig[1],
                            price=gig[2],
                            boxes=gig[3],
                            description=gig[4],
                            pickup_location=gig[5],
                            pickup_date=gig[6],
                            dropoff_location=gig[7],
                            dropoff_date=gig[8],
                            created_on_date=gig[9],
                            gig_status_id=gig[10],
                            mule_id=gig[11],
                        )
                        for gig in gig_db
                    ]
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500, detail="Could not retrieve list of Gigs"
            )
