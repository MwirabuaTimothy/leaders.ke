DROP TABLE IF EXISTS "fund_budget_lines" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "fund_expenses" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "funds" CASCADE;--> statement-breakpoint
ALTER TABLE "donations" DROP CONSTRAINT IF EXISTS "donations_fund_id_funds_id_fk";--> statement-breakpoint
DROP INDEX IF EXISTS "donations_fund_idx";--> statement-breakpoint
ALTER TABLE "donations" DROP COLUMN IF EXISTS "fund_id";
