CREATE TYPE "public"."user_roles" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "roles" "user_roles" DEFAULT 'user' NOT NULL;