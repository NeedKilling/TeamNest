DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'personnel' AND column_name = 'first_name'
    ) THEN
        ALTER TABLE "personnel" ADD COLUMN "first_name" varchar(255) NOT NULL DEFAULT '';
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'personnel' AND column_name = 'last_name'
    ) THEN
        ALTER TABLE "personnel" ADD COLUMN "last_name" varchar(255) NOT NULL DEFAULT '';
    END IF;
END $$;