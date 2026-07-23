-- ALTER TABLE "projects" ALTER COLUMN "user_id" DROP NOT NULL;
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'user_id'
    ) THEN
        -- Проверяем, что колонка существует, и снимаем NOT NULL
        ALTER TABLE "projects" ALTER COLUMN "user_id" DROP NOT NULL;
    END IF;
END $$;