steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE IF NOT EXISTS user_specialties (
            id SERIAL PRIMARY KEY NOT NULL,
            user_id INT,
            specialty_id INT,
            specialty_type_id INT,
            specialty_name VARCHAR(50) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (specialty_id) REFERENCES specialties(id)
        );

        """,
        # "Down" SQL statement
        """
        DROP TABLE user_specialties;
        """,
    ],
]
