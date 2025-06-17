steps = [
    [
        # "Up" SQL statement
        """
        -- Rename the table from gigs_for_mules to gigs_for_packers
        ALTER TABLE gigs_for_mules RENAME TO gigs_for_packers;
        
        -- Rename the column from mule_id to packer_id
        ALTER TABLE gigs_for_packers RENAME COLUMN mule_id TO packer_id;
        """,
        # "Down" SQL statement  
        """
        -- Rename back to original names
        ALTER TABLE gigs_for_packers RENAME COLUMN packer_id TO mule_id;
        ALTER TABLE gigs_for_packers RENAME TO gigs_for_mules;
        """,
    ],
]