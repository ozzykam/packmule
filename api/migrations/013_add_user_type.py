steps = [
    [
        # "Up" SQL statement
        """
        -- Add user_type column to users table
        ALTER TABLE users 
        ADD COLUMN user_type VARCHAR(20) NOT NULL DEFAULT 'packer';
        
        -- Create index for user_type for better query performance
        CREATE INDEX idx_users_user_type ON users(user_type);
        """,
        # "Down" SQL statement  
        """
        -- Remove the user_type column and index
        DROP INDEX IF EXISTS idx_users_user_type;
        ALTER TABLE users DROP COLUMN IF EXISTS user_type;
        """,
    ],
]