ALTER TABLE "donations" ADD COLUMN IF NOT EXISTS "fund_slug" varchar(60);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "donations_fund_idx" ON "donations" USING btree ("fund_slug","status");