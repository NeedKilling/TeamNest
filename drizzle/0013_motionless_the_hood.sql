DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user' AND column_name = 'last_name'
    ) THEN
      
    END IF;
END $$;