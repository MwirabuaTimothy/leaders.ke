CREATE TABLE "fund_budget_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"fund_id" integer NOT NULL,
	"label" varchar(150) NOT NULL,
	"amount_kes" integer NOT NULL,
	"note" text,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "fund_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"fund_id" integer NOT NULL,
	"description" varchar(255) NOT NULL,
	"amount_kes" integer NOT NULL,
	"spent_on" date NOT NULL,
	"receipt_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "funds" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(60) NOT NULL,
	"name" varchar(150) NOT NULL,
	"summary" text NOT NULL,
	"target_kes" integer NOT NULL,
	"surplus_policy" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "funds_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "donations" ALTER COLUMN "campaign_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "fund_id" integer;--> statement-breakpoint
ALTER TABLE "fund_budget_lines" ADD CONSTRAINT "fund_budget_lines_fund_id_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."funds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fund_expenses" ADD CONSTRAINT "fund_expenses_fund_id_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."funds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fund_budget_lines_fund_idx" ON "fund_budget_lines" USING btree ("fund_id","sort_order");--> statement-breakpoint
CREATE INDEX "fund_expenses_fund_idx" ON "fund_expenses" USING btree ("fund_id","spent_on");--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_fund_id_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."funds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "donations_fund_idx" ON "donations" USING btree ("fund_id","status");