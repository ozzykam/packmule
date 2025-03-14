steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE IF NOT EXISTS gigs (
            id SERIAL PRIMARY KEY NOT NULL,
            title VARCHAR(200) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            boxes VARCHAR(20) NOT NULL,
            description VARCHAR(500) NOT NULL,
            pickup_location JSONB NOT NULL,
            pickup_date TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 days'),
            dropoff_location JSONB NOT NULL,
            dropoff_date TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 days'),
            created_on_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE gigs;
        """,
    ],
]
