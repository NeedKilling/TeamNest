CREATE TYPE "public"."stage" AS ENUM('Идея', 'Реализация', 'Завершен');--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "stage" SET DEFAULT 'Идея'::"public"."stage";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "stage" SET DATA TYPE "public"."stage" USING "stage"::"public"."stage";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "start_date" timestamp DEFAULT now() NOT NULL;