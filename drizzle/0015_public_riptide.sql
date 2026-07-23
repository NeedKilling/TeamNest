-- DO $$
-- BEGIN
--     IF NOT EXISTS (
--         SELECT 1 FROM information_schema.columns 
--         WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'user_id'
--     ) THEN
--          ALTER TABLE "projects" ALTER COLUMN "user_id" SET NOT NULL;
--     END IF;
-- END $$;
DO $$
BEGIN
    -- Проверяем, что колонка user_id существует
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'user_id'
    ) THEN
        -- Проверяем, что колонка всё ещё допускает NULL (is_nullable = 'YES')
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'user_id'
            AND is_nullable = 'YES'
        ) THEN
            -- Проверяем, нет ли NULL-значений в колонке
            IF NOT EXISTS (SELECT 1 FROM "projects" WHERE "user_id" IS NULL) THEN
                ALTER TABLE "projects" ALTER COLUMN "user_id" SET NOT NULL;
            ELSE
                -- Если есть NULL, обновляем их на ID какого-то существующего пользователя (например, первого)
                -- Замените подзапрос на нужную логику, если требуется
                UPDATE "projects" SET "user_id" = (SELECT id FROM "user" LIMIT 1) WHERE "user_id" IS NULL;
                -- Теперь можно установить NOT NULL
                ALTER TABLE "projects" ALTER COLUMN "user_id" SET NOT NULL;
            END IF;
        END IF;
    END IF;
END $$;