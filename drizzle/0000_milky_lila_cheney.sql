DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stage') THEN
        CREATE TYPE "public"."stage" AS ENUM('Idea', 'Realization', 'Completed');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "categories" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS "industries" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "personnel" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"city" varchar(255) NOT NULL,
	"short_Resume" text NOT NULL,
	"education" text NOT NULL,
	"tg_username" varchar(255),
	"skills" varchar(255)[] DEFAULT '{}' NOT NULL,
	"specialization_id" varchar(255) NOT NULL,
	"categories_id" varchar(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"industries_id" varchar(255) NOT NULL,
	"stage" "stage" DEFAULT 'Idea',
	"start_date" timestamp NOT NULL,
	"link_project" text NOT NULL
);


CREATE TABLE IF NOT EXISTS "specialization" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL
);


DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'personnel_specialization_id_specialization_id_fk') THEN
        ALTER TABLE "personnel" ADD CONSTRAINT "personnel_specialization_id_specialization_id_fk" FOREIGN KEY ("specialization_id") REFERENCES "public"."specialization"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'personnel_categories_id_categories_id_fk') THEN
        ALTER TABLE "personnel" ADD CONSTRAINT "personnel_categories_id_categories_id_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END $$;


DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_industries_id_industries_id_fk') THEN
        ALTER TABLE "projects" ADD CONSTRAINT "projects_industries_id_industries_id_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE no action ON UPDATE no action;
    END IF;
END $$;