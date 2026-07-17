CREATE TABLE "favorite-projects" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "favorite-projects" ADD CONSTRAINT "favorite-projects_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite-projects" ADD CONSTRAINT "favorite-projects_user_id_projects_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;