steps = [
    [
        # "Up" SQL statement
        """
        -- Create gigs_for_packers table if it doesn't exist
        CREATE TABLE IF NOT EXISTS gigs_for_packers (
            id SERIAL PRIMARY KEY NOT NULL,
            gig_id INT,
            packer_id INT,
            gig_status_id INT DEFAULT 2,
            FOREIGN KEY (gig_id) REFERENCES gigs(id),
            FOREIGN KEY (packer_id) REFERENCES users(id),
            FOREIGN KEY (gig_status_id) REFERENCES gig_status(id)
        );
        
        -- If gigs_for_mules exists and has data, copy it to gigs_for_packers
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gigs_for_mules') THEN
                -- Copy data from gigs_for_mules to gigs_for_packers
                INSERT INTO gigs_for_packers (id, gig_id, packer_id, gig_status_id)
                SELECT id, gig_id, mule_id, gig_status_id FROM gigs_for_mules
                ON CONFLICT (id) DO NOTHING;
                
                -- Update sequence to continue from the highest id
                SELECT setval('gigs_for_packers_id_seq', COALESCE((SELECT MAX(id) FROM gigs_for_packers), 1));
                
                -- Drop the old table
                DROP TABLE gigs_for_mules;
            END IF;
        END $$;
        """,
        # "Down" SQL statement  
        """
        -- Recreate gigs_for_mules table if gigs_for_packers exists
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gigs_for_packers') THEN
                -- Create the old table structure
                CREATE TABLE IF NOT EXISTS gigs_for_mules (
                    id SERIAL PRIMARY KEY NOT NULL,
                    gig_id INT,
                    mule_id INT,
                    gig_status_id INT DEFAULT 2,
                    FOREIGN KEY (gig_id) REFERENCES gigs(id),
                    FOREIGN KEY (mule_id) REFERENCES users(id),
                    FOREIGN KEY (gig_status_id) REFERENCES gig_status(id)
                );
                
                -- Copy data back
                INSERT INTO gigs_for_mules (id, gig_id, mule_id, gig_status_id)
                SELECT id, gig_id, packer_id, gig_status_id FROM gigs_for_packers
                ON CONFLICT (id) DO NOTHING;
                
                -- Update sequence
                SELECT setval('gigs_for_mules_id_seq', COALESCE((SELECT MAX(id) FROM gigs_for_mules), 1));
                
                -- Drop the new table
                DROP TABLE gigs_for_packers;
            END IF;
        END $$;
        """,
    ],
]