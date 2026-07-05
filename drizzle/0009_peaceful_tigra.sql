DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'personnel' AND column_name = 'image'
    ) THEN
        ALTER TABLE "personnel" ADD COLUMN "image" varchar(255);
    END IF;
END $$;

--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'image'
    ) THEN
        ALTER TABLE "projects" ADD COLUMN "image" varchar(255);
    END IF;
END $$;