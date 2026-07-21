CREATE TABLE IF NOT EXISTS "favorite-personnel" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar NOT NULL,
	"personnel_id" varchar NOT NULL
);


DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'favorite-personnel_user_id_user_id_fk'
    ) THEN
        ALTER TABLE "favorite-personnel" ADD CONSTRAINT "favorite-personnel_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'favorite-personnel_personnel_id_personnel_id_fk'
    ) THEN
        ALTER TABLE "favorite-personnel" ADD CONSTRAINT "favorite-personnel_personnel_id_personnel_id_fk" FOREIGN KEY ("personnel_id") REFERENCES "public"."personnel"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;