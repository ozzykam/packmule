steps = [
    [
        # "Up" SQL statement
        """
        -- Check if gigs_for_mules exists and rename it, otherwise ensure gigs_for_packers exists
        DO $$ 
        BEGIN
            -- If gigs_for_mules exists, rename it to gigs_for_packers
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gigs_for_mules') THEN
                ALTER TABLE gigs_for_mules RENAME TO gigs_for_packers;
                -- Also rename the column if it exists
                IF EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'gigs_for_packers' AND column_name = 'mule_id') THEN
                    ALTER TABLE gigs_for_packers RENAME COLUMN mule_id TO packer_id;
                END IF;
            -- If gigs_for_packers doesn't exist but gigs_for_mules doesn't either, create it
            ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gigs_for_packers') THEN
                CREATE TABLE gigs_for_packers (
                    id SERIAL PRIMARY KEY NOT NULL,
                    gig_id INT NOT NULL,
                    packer_id INT NOT NULL,
                    gig_status_id INT DEFAULT 2,
                    FOREIGN KEY (gig_id) REFERENCES gigs(id) ON DELETE CASCADE,
                    FOREIGN KEY (packer_id) REFERENCES users(id) ON DELETE CASCADE,
                    FOREIGN KEY (gig_status_id) REFERENCES gig_status(id)
                );
            -- If gigs_for_packers exists but has mule_id column, rename the column
            ELSIF EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'gigs_for_packers' AND column_name = 'mule_id') THEN
                ALTER TABLE gigs_for_packers RENAME COLUMN mule_id TO packer_id;
            END IF;
        END $$;
        """,
        # "Down" SQL statement  
        """
        -- Rename back to original names if possible
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gigs_for_packers') THEN
                IF EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'gigs_for_packers' AND column_name = 'packer_id') THEN
                    ALTER TABLE gigs_for_packers RENAME COLUMN packer_id TO mule_id;
                END IF;
                ALTER TABLE gigs_for_packers RENAME TO gigs_for_mules;
            END IF;
        END $$;
        """,
    ],
]