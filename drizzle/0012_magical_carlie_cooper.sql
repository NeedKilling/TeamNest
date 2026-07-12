CREATE TABLE IF NOT EXISTS "feedback" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"message" text NOT NULL
);