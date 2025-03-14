steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE IF NOT EXISTS gig_specialties (
            id SERIAL PRIMARY KEY NOT NULL,
            gig_id INT,
            specialty_id INT,
            specialty_name VARCHAR(50),
            specialty_type_id INT,
            FOREIGN KEY (gig_id) REFERENCES gigs(id),
            FOREIGN KEY (specialty_id) REFERENCES specialties(id)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE gig_specialties;
        """,
    ],
]
