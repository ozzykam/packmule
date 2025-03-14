steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE IF NOT EXISTS specialties (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(250) DEFAULT 'Description not yet provided',
            specialty_type_id INT NOT NULL,
            FOREIGN KEY (specialty_type_id) REFERENCES specialty_type(id)
        );
        INSERT INTO specialties(specialty_type_id, name)
        VALUES
        (1, 'heavy straps'),
        (1, 'dolly'),
        (2, 'piano'),
        (2, 'antiques'),
        (2, 'aquariums'),
        (2, 'large animals'),
        (2, 'pets'),
        (2, 'fine art'),
        (3, 'box truck'),
        (3, 'crane'),
        (3, 'cargo van'),
        (3, 'horse trailer'),
        (3, 'flatbed trailer'),
        (3, 'vehicle trailer');
        """,
        # "Down" SQL statement
        """
        DROP TABLE specialties;
        """,
    ],
]
