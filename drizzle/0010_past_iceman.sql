DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'personnel' AND column_name = 'full_name'
    ) THEN
        ALTER TABLE "personnel" DROP COLUMN "full_name";
    END IF;
END $$;