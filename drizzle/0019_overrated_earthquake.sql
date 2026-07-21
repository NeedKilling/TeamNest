
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'favorite-projects_user_id_projects_id_fk'
    ) THEN
        ALTER TABLE "favorite-projects" DROP CONSTRAINT "favorite-projects_user_id_projects_id_fk";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'favorite-projects' AND column_name = 'project_id'
    ) THEN
        ALTER TABLE "favorite-projects" ADD COLUMN "project_id" varchar NOT NULL DEFAULT '';
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'favorite-projects_project_id_projects_id_fk'
    ) THEN
        ALTER TABLE "favorite-projects" ADD CONSTRAINT "favorite-projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;