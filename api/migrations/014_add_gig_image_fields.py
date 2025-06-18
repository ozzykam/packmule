steps = [
    [
        # "Up" SQL statement
        """
        -- Add customer_id column if it doesn't already exist
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='gigs' AND column_name='customer_id') THEN
                ALTER TABLE gigs ADD COLUMN customer_id INTEGER REFERENCES users(id);
                CREATE INDEX idx_gigs_customer_id ON gigs(customer_id);
            END IF;
        END $$;
        
        -- Add images column to store array of image URLs/paths
        ALTER TABLE gigs 
        ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
        
        -- Add specialties column to store array of specialty IDs
        ALTER TABLE gigs 
        ADD COLUMN specialties JSONB DEFAULT '[]'::jsonb;
        
        -- Add featured_image_index to specify which image is the featured one
        ALTER TABLE gigs 
        ADD COLUMN featured_image_index INTEGER;
        
        -- Create indexes for better query performance
        CREATE INDEX idx_gigs_images ON gigs USING GIN (images);
        CREATE INDEX idx_gigs_specialties ON gigs USING GIN (specialties);
        CREATE INDEX idx_gigs_featured_image_index ON gigs(featured_image_index);
        """,
        # "Down" SQL statement  
        """
        -- Remove the indexes and columns
        DROP INDEX IF EXISTS idx_gigs_featured_image_index;
        DROP INDEX IF EXISTS idx_gigs_specialties;
        DROP INDEX IF EXISTS idx_gigs_images;
        ALTER TABLE gigs DROP COLUMN IF EXISTS featured_image_index;
        ALTER TABLE gigs DROP COLUMN IF EXISTS specialties;
        ALTER TABLE gigs DROP COLUMN IF EXISTS images;
        """,
    ],
]