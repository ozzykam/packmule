steps = [
    [
        # "Up" SQL statement
        """
        -- Add user_type column to users table if it doesn't exist
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name='users' AND column_name='user_type') THEN
                ALTER TABLE users 
                ADD COLUMN user_type VARCHAR(20) NOT NULL DEFAULT 'packer';
            END IF;
        END $$;
        
        -- Create index for user_type for better query performance (if it doesn't exist)
        CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
        """,
        # "Down" SQL statement  
        """
        -- Remove the user_type column and index
        DROP INDEX IF EXISTS idx_users_user_type;
        ALTER TABLE users DROP COLUMN IF EXISTS user_type;
        """,
    ],
]