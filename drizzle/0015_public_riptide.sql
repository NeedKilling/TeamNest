DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'user_id'
    ) THEN
         ALTER TABLE "projects" ALTER COLUMN "user_id" SET NOT NULL;
    END IF;
END $$;