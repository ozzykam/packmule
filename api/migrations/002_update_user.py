steps = [
    [
        # "Up" SQL statement
        """
        ALTER TABLE users
        ADD name VARCHAR(100) NOT NULL,
        ADD email VARCHAR(100) NOT NULL,
        ADD phone VARCHAR(20) NOT NULL,
        ADD bio VARCHAR(500)
        ;
        """,
        # "Down" SQL statement
        """
        ALTER TABLE users
        DROP COLUMN name,
        DROP COLUMN email,
        DROP COLUMN phone,
        DROP COLUMN bio
        ;
        """,
    ],
]
