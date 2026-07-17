ALTER TABLE "favorite-projects" DROP CONSTRAINT "favorite-projects_user_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "favorite-projects" ADD COLUMN "project_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "favorite-projects" ADD CONSTRAINT "favorite-projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;