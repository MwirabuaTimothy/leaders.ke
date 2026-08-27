// The public funding page for the civic register.
//
// A transparency artefact first and a donate form second, and that order is the
// point: a register that demands a public record has no business keeping its own
// budget and spending private.
//
// Everything the page SAYS is static (src/lib/data/supportFund.ts): the budget,
// the donated-labour lines, the ledger and the copy are authored content, so an
// edit is a diff and a deploy rather than a database write nobody can review.
// The only thing read from the database is what real people created: their
// contributions.
//
// Deliberately NOT /fundraising, which is the marketing page for the
// candidate-facing feature. A citizen must never confuse funding this register
// with funding a politician.
import { fail } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { and, desc, eq, isNull, sum } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { donations } from '$lib/server/db/schema';
import {
	CASH_LINES,
	CASH_TARGET_KES,
	EXPENSES,
	PROJECT_TOTAL_KES,
	SPENT_KES,
	SUPPORT_FUND,
	VOLUNTEERED_KES,
	VOLUNTEERED_LINES
} from '$lib/data/supportFund';
import { chargeMobileMoney, normalizeMpesaPhone, paystackEnabled } from '$lib/server/paystack';
import { enforceRateLimit, ipBucket } from '$lib/server/rateLimit';
import type { Actions, PageServerLoad } from './$types';

const forFund = eq(donations.fundSlug, SUPPORT_FUND.slug);

export const load: PageServerLoad = async () => {
	const [[raised], [pledged], contributors] = await Promise.all([
		// Confirmed money only. A pending STK push is not income until the webhook says so.
		db
			.select({ total: sum(donations.amount) })
			.from(donations)
			.where(and(forFund, eq(donations.status, 'confirmed'), isNull(donations.deletedAt))),
		db
			.select({ total: sum(donations.amount) })
			.from(donations)
			.where(and(forFund, eq(donations.status, 'pending'), isNull(donations.deletedAt))),
		// Only donors who consented appear by name; everyone else is counted, not listed.
		db
			.select({ donorName: donations.donorName, amount: donations.amount, at: donations.createdAt })
			.from(donations)
			.where(and(forFund, eq(donations.status, 'confirmed'), eq(donations.isPublic, true), isNull(donations.deletedAt)))
			.orderBy(desc(donations.createdAt))
			.limit(50)
	]);

	const raisedKes = Number(raised?.total ?? 0);

	return {
		fund: SUPPORT_FUND,
		budget: CASH_LINES,
		volunteered: VOLUNTEERED_LINES,
		expenses: EXPENSES,
		cashTotalKes: CASH_TARGET_KES,
		volunteeredKes: VOLUNTEERED_KES,
		projectTotalKes: PROJECT_TOTAL_KES,
		raisedKes,
		pendingKes: Number(pledged?.total ?? 0),
		spentKes: SPENT_KES,
		balanceKes: raisedKes - SPENT_KES,
		contributors,
		mpesaLive: paystackEnabled()
	};
};

export const actions: Actions = {
	contribute: async (event) => {
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
		// on the reference alone, so a fund contribution is fulfilled by the same
		// path a campaign donation is, with no change there.
		if (paystackEnabled() && mpesaPhone) {
			const reference = `don_${randomUUID()}`;
			await db.insert(donations).values({
				fundSlug: SUPPORT_FUND.slug,
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
			fundSlug: SUPPORT_FUND.slug,
			donorName,
			phoneNumber: phone || null,
			amount: Math.round(amount),
			isPublic
		});
		return { contributed: true, stk: false, amount: Math.round(amount) };
	}
};
