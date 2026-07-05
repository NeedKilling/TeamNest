DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'personnel' AND column_name = 'contacts'
    ) THEN
        ALTER TABLE "personnel" ADD COLUMN "contacts" jsonb DEFAULT '[]'::jsonb NOT NULL;
    END IF;
END $$;