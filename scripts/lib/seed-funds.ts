// Seeds the public fund behind /support: the appeal itself, and the budget lines
// the page prints.
//
// The target deliberately EXCLUDES the engineering. The build and the ongoing
// maintenance are volunteered, so asking the public to fund them would make
// "nobody is paid to build this" untrue on the same page it is claimed. What is
// listed here is cash that actually leaves an account: carrier fees, hosting,
// inference, and the county coordinator stipends that generate reporting volume.
//
// Figures come from docs/pivot-to-forum-register.md Part 2. SMS is Africa's
// Talking published pricing (KES 0.80 + 16% VAT); AI inference is measured off
// the live daily classification run. The shortcode lines are indicative and
// carry the only unquoted numbers on the page.
// Idempotent: matched on funds.slug and (fundId, label).
import { and, eq, isNull } from 'drizzle-orm';
import { fundBudgetLines, funds } from '../../src/lib/server/db/schema';
import type { AnyDb } from './names';

const SLUG = 'civic-register';

type Line = { label: string; amountKes: number; note: string; isRecurring: boolean };

const LINES: Line[] = [
	{
		label: 'Dedicated shortcode setup and carrier integration',
		amountKes: 150_000,
		note: 'A shared shortcode will not do for a record that has to be auditable. Indicative, pending a written quote.',
		isRecurring: false
	},
	{
		label: 'WhatsApp Business API onboarding',
		amountKes: 120_000,
		note: 'Meta business verification, template approval and number provisioning.',
		isRecurring: false
	},
	{
		label: 'Shortcode rental, 12 months',
		amountKes: 300_000,
		note: 'Indicative at KES 25,000 a month, pending a written quote.',
		isRecurring: true
	},
	{
		label: 'SMS, 150,000 messages',
		amountKes: 140_000,
		note: "Inbound reports and outbound confirmations at Africa's Talking published KES 0.80 plus 16% VAT.",
		isRecurring: true
	},
	{
		label: 'WhatsApp conversations, 12 months',
		amountKes: 100_000,
		note: "Meta per-conversation pricing. Service-window replies are largely free.",
		isRecurring: true
	},
	{
		label: 'Hosting, object storage and backups, 12 months',
		amountKes: 180_000,
		note: 'Runs on infrastructure that already exists, so this is the marginal cost only.',
		isRecurring: true
	},
	{
		label: 'AI inference, 12 months',
		amountKes: 25_000,
		note: 'Measured at about USD 0.004 a day on the current daily classification. This carries 20x headroom and is still the smallest line here.',
		isRecurring: true
	},
	{
		label: 'County coordinator stipends, 10 counties',
		amountKes: 360_000,
		note: 'KES 3,000 a month each. The people who actually generate reporting volume, and the largest recurring line.',
		isRecurring: true
	}
];

const TARGET = LINES.reduce((n, l) => n + l.amountKes, 0);

export async function seedFunds(db: AnyDb) {
	const [existing] = await db.select({ id: funds.id }).from(funds).where(eq(funds.slug, SLUG));

	const fundId =
		existing?.id ??
		(
			await db
				.insert(funds)
				.values({
					slug: SLUG,
					name: 'Fund the civic register',
					summary:
						'A public record of political violence, intimidation and how leaders behave in office. A citizen texts a shortcode, we verify the number, tag the report to a ward and the leader named, and publish it permanently. We never rule that a report is true. We publish how many independent verified people said the same thing.',
					targetKes: TARGET,
					surplusPolicy:
						'If more is raised than the budget below, the surplus extends county coordinator coverage beyond the first ten counties and is listed here before it is spent. If less is raised, the shortcode and coordinator lines shrink first and the register still runs on the web and WhatsApp intake.'
				})
				.returning({ id: funds.id })
		)[0].id;

	const already = await db
		.select({ label: fundBudgetLines.label })
		.from(fundBudgetLines)
		.where(and(eq(fundBudgetLines.fundId, fundId), isNull(fundBudgetLines.deletedAt)));
	const seen = new Set(already.map((l) => l.label));
	const fresh = LINES.filter((l) => !seen.has(l.label));

	if (fresh.length) {
		await db
			.insert(fundBudgetLines)
			.values(fresh.map((l, i) => ({ fundId, ...l, sortOrder: already.length + i })));
	}

	console.log(
		`[funds] ${existing ? 'reused' : 'created'} "${SLUG}" (target KES ${TARGET.toLocaleString('en-KE')}), ${fresh.length} budget line(s) added`
	);
}
