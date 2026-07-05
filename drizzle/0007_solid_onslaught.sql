DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_roles') THEN
        CREATE TYPE "public"."user_roles" AS ENUM('user', 'admin');
    END IF;
END $$;

--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user' AND column_name = 'roles'
    ) THEN
        ALTER TABLE "user" ADD COLUMN "roles" "user_roles" DEFAULT 'user' NOT NULL;
    END IF;
END $$;