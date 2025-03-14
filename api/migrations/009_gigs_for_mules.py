steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE IF NOT EXISTS gigs_for_mules (
            id SERIAL PRIMARY KEY NOT NULL,
            gig_id INT,
            mule_id INT,
            gig_status_id INT DEFAULT 2,
            FOREIGN KEY (gig_id) REFERENCES gigs(id),
            FOREIGN KEY (mule_id) REFERENCES users(id),
            FOREIGN KEY (gig_status_id) REFERENCES gig_status(id)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE gigs_for_mules;
        """,
    ],
]
