steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE IF NOT EXISTS gig_status (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(10) NOT NULL
        );
        INSERT INTO gig_status(name)
        VALUES
        ('available'),
        ('booked'),
        ('completed');
        """,
        # "Down" SQL statement
        """
        DROP TABLE gig_status;
        """,
    ],
]
