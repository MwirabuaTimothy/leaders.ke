// The public funding page for a project fund (the incident register, today).
//
// A transparency artefact first and a donate form second, and that order is the
// point: a register that demands a public record has no business keeping its own
// budget and spending private. So the page prints the budget, what has been
// raised, and every shilling out, before it asks for anything.
//
// Deliberately NOT /fundraising, which is the marketing page for the
// candidate-facing feature. A citizen must never confuse funding this register
// with funding a politician.
import { error, fail } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { and, desc, eq, isNull, sum } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { donations, fundBudgetLines, fundExpenses, funds } from '$lib/server/db/schema';
import { chargeMobileMoney, normalizeMpesaPhone, paystackEnabled } from '$lib/server/paystack';
import { enforceRateLimit, ipBucket } from '$lib/server/rateLimit';
import type { Actions, PageServerLoad } from './$types';

/** The one live fund. A slug column exists for a second one later, but a single
 * appeal needs no route parameter and no chooser. */
async function activeFund() {
	const [fund] = await db
		.select()
		.from(funds)
		.where(and(eq(funds.isActive, true), isNull(funds.deletedAt)))
		.limit(1);
	return fund;
}

export const load: PageServerLoad = async () => {
	const fund = await activeFund();
	if (!fund) throw error(404, 'No public fund is open right now.');

	const [budget, expenses, [raised], [pledged], contributors] = await Promise.all([
		db
			.select()
			.from(fundBudgetLines)
			.where(and(eq(fundBudgetLines.fundId, fund.id), isNull(fundBudgetLines.deletedAt)))
			.orderBy(fundBudgetLines.sortOrder),
		db
			.select()
			.from(fundExpenses)
			.where(and(eq(fundExpenses.fundId, fund.id), isNull(fundExpenses.deletedAt)))
			.orderBy(desc(fundExpenses.spentOn)),
		// Confirmed money only. A pending STK push is not income until the webhook says so.
		db
			.select({ total: sum(donations.amount) })
			.from(donations)
			.where(and(eq(donations.fundId, fund.id), eq(donations.status, 'confirmed'), isNull(donations.deletedAt))),
		db
			.select({ total: sum(donations.amount) })
			.from(donations)
			.where(and(eq(donations.fundId, fund.id), eq(donations.status, 'pending'), isNull(donations.deletedAt))),
		// Only donors who consented appear by name; everyone else is counted, not listed.
		db
			.select({ donorName: donations.donorName, amount: donations.amount, at: donations.createdAt })
			.from(donations)
			.where(and(eq(donations.fundId, fund.id), eq(donations.status, 'confirmed'), eq(donations.isPublic, true), isNull(donations.deletedAt)))
			.orderBy(desc(donations.createdAt))
			.limit(50)
	]);

	const raisedKes = Number(raised?.total ?? 0);
	const spentKes = expenses.reduce((n, e) => n + e.amountKes, 0);
	// Split rather than filtered in SQL: both halves come off one ordered read,
	// and the page prints them as two separate stories (what money buys, and what
	// is given). Volunteered lines never count toward the target.
	const cash = budget.filter((b) => !b.isVolunteered);
	const volunteered = budget.filter((b) => b.isVolunteered);

	return {
		fund,
		budget: cash,
		volunteered,
		volunteeredKes: volunteered.reduce((n, b) => n + b.amountKes, 0),
		expenses,
		raisedKes,
		pendingKes: Number(pledged?.total ?? 0),
		spentKes,
		balanceKes: raisedKes - spentKes,
		contributors,
		mpesaLive: paystackEnabled()
	};
};

export const actions: Actions = {
	contribute: async (event) => {
		const fund = await activeFund();
		if (!fund) return fail(400, { error: 'No public fund is open right now.' });

		const form = await event.request.formData();
		const donorName = String(form.get('donorName') ?? '').trim();
		const phone = String(form.get('phone') ?? '').replace(/[^\d+]/g, '');
		const amount = Number(form.get('amount') ?? 0);
		const isPublic = form.get('isPublic') === '1';

		if (!donorName || !Number.isFinite(amount) || amount < 10) {
			return fail(400, { error: 'Your name and an amount (KES 10 or more) are required.' });
		}

		// Open form that can fire an STK push, so cap per IP and per phone. Same
		// guard the campaign donate action uses.
		const limit = await enforceRateLimit('donate', [ipBucket(event), phone ? `contact:${phone}` : '']);
		if (!limit.ok) return fail(429, { error: 'Too many attempts. Please wait a minute and try again.' });

		const mpesaPhone = phone ? normalizeMpesaPhone(phone) : null;

		// The `don_` prefix matters: the shared Paystack webhook already confirms
		// and fails donations by that reference (donationFulfill.ts), and it keys
		// on the reference alone, so a fund donation is fulfilled by the same path
		// a campaign donation is, with no change there.
		if (paystackEnabled() && mpesaPhone) {
			const reference = `don_${randomUUID()}`;
			await db.insert(donations).values({
				fundId: fund.id,
				donorName,
				phoneNumber: mpesaPhone,
				amount: Math.round(amount),
				isPublic,
				reference
			});
			try {
				await chargeMobileMoney({
					email: `donor-${mpesaPhone.replace('+', '')}@vote.ke`,
					amountKes: Math.round(amount),
					phone: mpesaPhone,
					reference
				});
			} catch (err) {
				// No money moved, so the row must not linger as a pending pledge.
				await db
					.update(donations)
					.set({ status: 'failed', updatedAt: new Date() })
					.where(eq(donations.reference, reference));
				console.error(`[support] STK charge failed for ${reference}:`, err instanceof Error ? err.message : err);
				return fail(502, { error: 'Could not reach M-Pesa right now. Try again in a moment.' });
			}
			return { contributed: true, stk: true, amount: Math.round(amount) };
		}

		// No key or no usable number: a recorded pledge, confirmed by hand against
		// the till statement, same as the campaign path.
		await db.insert(donations).values({
			fundId: fund.id,
			donorName,
			phoneNumber: phone || null,
			amount: Math.round(amount),
			isPublic
		});
		return { contributed: true, stk: false, amount: Math.round(amount) };
	}
};
