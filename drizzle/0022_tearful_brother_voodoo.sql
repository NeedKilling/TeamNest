
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'vacancies'
    ) THEN
        
        IF EXISTS (
            SELECT 1 FROM pg_attrdef 
            JOIN pg_class ON pg_attrdef.adrelid = pg_class.oid
            JOIN pg_attribute ON pg_attrdef.adrelid = pg_attribute.attrelid 
                AND pg_attrdef.adnum = pg_attribute.attnum
            WHERE pg_class.relname = 'projects' 
            AND pg_attribute.attname = 'vacancies'
        ) THEN
            ALTER TABLE "projects" ALTER COLUMN "vacancies" DROP DEFAULT;
        END IF;
    END IF;
END $$;


DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'vacancies'
    ) THEN
    
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'vacancies'
            AND data_type = 'jsonb'
        ) THEN
        
            EXECUTE 'ALTER TABLE "projects" ALTER COLUMN "vacancies" SET DATA TYPE jsonb USING to_jsonb(vacancies)';
        END IF;
    END IF;
END $$;