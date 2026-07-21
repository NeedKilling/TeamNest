DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'vacancies'
    ) THEN
        ALTER TABLE "projects" ADD COLUMN "vacancies" varchar[] DEFAULT '{}';
    END IF;
END $$;