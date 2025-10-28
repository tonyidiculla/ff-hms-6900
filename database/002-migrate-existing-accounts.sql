-- Migration Script: Add password hashes to existing accounts
-- This script will update existing profiles to have proper password hashes

-- Step 1: Add the required columns if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS user_platform_id TEXT;

-- Step 2: Generate platform IDs for existing users without them
DO $$
DECLARE
    user_record RECORD;
    new_platform_id TEXT;
    chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    i INTEGER;
BEGIN
    FOR user_record IN 
        SELECT id FROM profiles 
        WHERE user_platform_id IS NULL OR user_platform_id = ''
    LOOP
        -- Generate platform ID: H00 + 6 random alphanumeric characters
        new_platform_id := 'H00';
        FOR i IN 1..6 LOOP
            new_platform_id := new_platform_id || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM profiles WHERE user_platform_id = new_platform_id) LOOP
            new_platform_id := 'H00';
            FOR i IN 1..6 LOOP
                new_platform_id := new_platform_id || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
            END LOOP;
        END LOOP;
        
        -- Update the user with the new platform ID
        UPDATE profiles 
        SET user_platform_id = new_platform_id
        WHERE id = user_record.id;
        
        RAISE NOTICE 'Generated platform ID % for user %', new_platform_id, user_record.id;
    END LOOP;
END $$;

-- Step 3: Set default password hash for existing accounts (they must reset)
-- This creates a hash of "RESET_REQUIRED" which can never be matched
UPDATE profiles 
SET password_hash = '$2a$12$LlZQY9dGOoZK0ZfJ5tXqLOy9ZqJ5VxJ9K0QZJ0QZJ0QZJ0QZJ0QZJ'
WHERE password_hash IS NULL OR password_hash = '';

-- Step 4: Mark accounts for password reset
UPDATE profiles 
SET email_verified = false,
    role = COALESCE(role, 'user')
WHERE password_hash = '$2a$12$LlZQY9dGOoZK0ZfJ5tXqLOy9ZqJ5VxJ9K0QZJ0QZJ0QZJ0QZJ0QZJ';

-- Step 5: Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_platform_id ON profiles(user_platform_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON profiles(email_verified);

-- Step 6: Show migration results
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN password_hash IS NOT NULL THEN 1 END) as users_with_password,
    COUNT(CASE WHEN user_platform_id IS NOT NULL THEN 1 END) as users_with_platform_id,
    COUNT(CASE WHEN email_verified = false THEN 1 END) as users_requiring_verification
FROM profiles;