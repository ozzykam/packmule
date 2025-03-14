steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE IF NOT EXISTS specialty_type (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(50) NOT NULL
        );
        INSERT INTO specialty_type(name)
        VALUES
        ('equipment'),
        ('experience'),
        ('vehicle')
        ;
        """,
        # "Down" SQL statement
        """
        DROP TABLE specialty_type;
        """,
    ],
]
