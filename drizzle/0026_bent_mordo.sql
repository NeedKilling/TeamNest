CREATE TYPE "public"."application_type" AS ENUM('application', 'invitation');--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "type" "application_type" DEFAULT 'application' NOT NULL;