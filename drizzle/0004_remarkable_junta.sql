DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'personnel' AND column_name = 'contacts'
    ) THEN
        ALTER TABLE "personnel" DROP COLUMN "contacts";
    END IF;
END $$;