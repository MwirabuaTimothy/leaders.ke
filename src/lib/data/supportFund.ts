// Everything the /support page says, in one editable file.
//
// This is CONTENT, not data: a budget line changes when a quote comes back, not
// when a user does something, so it lives in the repo where an edit is a diff
// and a deploy, and the whole page can be reviewed by reading one file. The only
// thing /support reads from the database is the contributor list, because that
// is the one part real people create.
//
// Figures come from docs/pivot-to-forum-register.md Part 2. SMS is Africa's
// Talking published pricing (KES 0.80 + 16% VAT); AI inference is measured off
// the live daily classification run. The shortcode lines are the only unquoted
// numbers on the page and are labelled as such.

export type BudgetLine = {
	label: string;
	amountKes: number;
	/** Why this line costs what it costs. Printed under the label. */
	note: string;
	/** One-off cash outlay vs a recurring running cost. */
	isRecurring: boolean;
};

/** One payment out of the fund. The public ledger. */
export type Expense = {
	description: string;
	amountKes: number;
	/** ISO date, printed as-is. */
	spentOn: string;
};

// Cash that actually leaves an account. The sum of these IS the ask.
export const CASH_LINES: BudgetLine[] = [
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
		note: 'Meta per-conversation pricing. Service-window replies are largely free.',
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

// Work given rather than bought, priced at what it would cost to buy. Printed so
// the true cost of the register is visible, and deliberately NOT part of the
// target: asking the public to pay for donated labour would make "nobody is paid
// to build this" false on the page that claims it.
export const VOLUNTEERED_LINES: BudgetLine[] = [
	{
		label: 'Engineering, 7 weeks',
		amountKes: 700_000,
		note: 'Schema, web and SMS intake, number verification, photo upload, the corroboration counter, incident pages and the county map. 35 working days at a KES 20,000 Nairobi contract rate.',
		isRecurring: false
	},
	{
		label: 'News source vetting',
		amountKes: 180_000,
		note: 'A publisher allowlist, so the register can never repeat a fabricated story as though it were sourced. Nine days.',
		isRecurring: false
	},
	{
		label: 'County coordinator toolkit and 3-county pilot',
		amountKes: 200_000,
		note: 'Training material, a dry run, and the fixes the dry run finds.',
		isRecurring: false
	},
	{
		label: 'Maintenance and support, 12 months',
		amountKes: 520_000,
		note: 'Half a day a week for a year. Someone answers when a county coordinator cannot submit a report at 21:00.',
		isRecurring: true
	}
];

// The ledger. Add a row here every time money leaves the fund, newest first.
export const EXPENSES: Expense[] = [];

export const CASH_TARGET_KES = CASH_LINES.reduce((n, l) => n + l.amountKes, 0);
export const VOLUNTEERED_KES = VOLUNTEERED_LINES.reduce((n, l) => n + l.amountKes, 0);
export const PROJECT_TOTAL_KES = CASH_TARGET_KES + VOLUNTEERED_KES;
export const SPENT_KES = EXPENSES.reduce((n, e) => n + e.amountKes, 0);

export const SUPPORT_FUND = {
	/** Stamped on every donation row, so contributions stay attributable if a
	 * second fund is ever added. Changing it orphans existing donations. */
	slug: 'civic-register',
	name: 'Fund the civic register',
	summary:
		'A public record of political violence, intimidation and how leaders behave in office. A citizen texts a shortcode, we verify the number, tag the report to a ward and the leader named, and publish it permanently. We never rule that a report is true. We publish how many independent verified people said the same thing.',
	targetKes: CASH_TARGET_KES,
	surplusPolicy:
		'If more is raised than the budget above, the surplus extends county coordinator coverage beyond the first ten counties and is listed here before it is spent. If less is raised, the shortcode and coordinator lines shrink first and the register still runs on the web and WhatsApp intake.'
} as const;
