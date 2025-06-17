steps = [
    [
        # "Up" SQL statement
        """
        -- Check if gigs_for_mules exists and gigs_for_packers doesn't exist, then rename
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gigs_for_mules')
               AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gigs_for_packers') THEN
                -- Rename the table from gigs_for_mules to gigs_for_packers
                ALTER TABLE gigs_for_mules RENAME TO gigs_for_packers;
                
                -- Rename the column from mule_id to packer_id
                ALTER TABLE gigs_for_packers RENAME COLUMN mule_id TO packer_id;
            END IF;
        END $$;
        """,
        # "Down" SQL statement  
        """
        -- Check if gigs_for_packers exists and gigs_for_mules doesn't exist, then rename back
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gigs_for_packers')
               AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gigs_for_mules') THEN
                -- Rename back to original names
                ALTER TABLE gigs_for_packers RENAME COLUMN packer_id TO mule_id;
                ALTER TABLE gigs_for_packers RENAME TO gigs_for_mules;
            END IF;
        END $$;
        """,
    ],
]