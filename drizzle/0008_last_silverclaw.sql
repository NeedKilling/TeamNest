CREATE TABLE IF NOT EXISTS "files" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"size" integer NOT NULL,
	"contentType" varchar(255) NOT NULL
);