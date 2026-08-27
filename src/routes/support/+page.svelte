<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	// ─────────────────────────────────────────────────────────────────────────
	// PAGE CONTENT. Edit here, save, see it. Nothing below comes from a database
	// or a data file. The only thing the server supplies is the contributions
	// people have actually made.
	//
	// Figures come from docs/pivot-to-forum-register.md Part 2. SMS is Africa's
	// Talking published pricing (KES 0.80 + 16% VAT); AI inference is measured off
	// the live daily classification run. The shortcode lines are the only unquoted
	// numbers on the page and say so.
	// ─────────────────────────────────────────────────────────────────────────

	type Line = { label: string; amount: number; note: string; recurring?: boolean };

	// Cash that actually leaves an account. The sum of these IS the ask.
	const CASH: Line[] = [
		{
			label: 'Dedicated shortcode setup and carrier integration',
			amount: 150_000,
			note: 'A shared shortcode will not do for a record that has to be auditable. Indicative, pending a written quote.'
		},
		{
			label: 'WhatsApp Business API onboarding',
			amount: 120_000,
			note: 'Meta business verification, template approval and number provisioning.'
		},
		{
			label: 'Shortcode rental, 12 months',
			amount: 300_000,
			note: 'Indicative at KES 25,000 a month, pending a written quote.',
			recurring: true
		},
		{
			label: 'SMS, 150,000 messages',
			amount: 140_000,
			note: "Inbound reports and outbound confirmations at Africa's Talking published KES 0.80 plus 16% VAT.",
			recurring: true
		},
		{
			label: 'WhatsApp conversations, 12 months',
			amount: 100_000,
			note: 'Meta per-conversation pricing. Service-window replies are largely free.',
			recurring: true
		},
		{
			label: 'Hosting, object storage and backups, 12 months',
			amount: 180_000,
			note: 'Runs on infrastructure that already exists, so this is the marginal cost only.',
			recurring: true
		},
		{
			label: 'AI inference, 12 months',
			amount: 25_000,
			note: 'Measured at about USD 0.004 a day on the current daily classification. This carries 20x headroom and is still the smallest line here.',
			recurring: true
		},
		{
			label: 'County coordinator stipends, 10 counties',
			amount: 360_000,
			note: 'KES 3,000 a month each. The people who actually generate reporting volume, and the largest recurring line.',
			recurring: true
		}
	];

	// Work given rather than bought, priced at what it would cost to buy. Printed
	// so the true cost of the register is visible, and deliberately NOT part of
	// the target: asking the public to pay for donated labour would make "nobody
	// is paid to build this" false on the page that claims it.
	const DONATED: Line[] = [
		{
			label: 'Engineering, 7 weeks',
			amount: 700_000,
			note: 'Schema, web and SMS intake, number verification, photo upload, the corroboration counter, incident pages and the county map. 35 working days at a KES 20,000 Nairobi contract rate.'
		},
		{
			label: 'News source vetting',
			amount: 180_000,
			note: 'A publisher allowlist, so the register can never repeat a fabricated story as though it were sourced. Nine days.'
		},
		{
			label: 'County coordinator toolkit and 3-county pilot',
			amount: 200_000,
			note: 'Training material, a dry run, and the fixes the dry run finds.'
		},
		{
			label: 'Maintenance and support, 12 months',
			amount: 520_000,
			note: 'Half a day a week for a year. Someone answers when a county coordinator cannot submit a report at 21:00.',
			recurring: true
		}
	];

	// The ledger. Add a row every time money leaves the fund, newest first.
	const SPENT: { description: string; amount: number; on: string }[] = [];

	// ── end of content ───────────────────────────────────────────────────────

	const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`;
	const sum = (lines: { amount: number }[]) => lines.reduce((n, l) => n + l.amount, 0);

	const cashTotal = sum(CASH);
	const donatedTotal = sum(DONATED);
	const projectTotal = cashTotal + donatedTotal;
	const spentTotal = SPENT.reduce((n, e) => n + e.amount, 0);

	const groups = [
		{ label: 'One-off', lines: CASH.filter((l) => !l.recurring) },
		{ label: 'Running costs', lines: CASH.filter((l) => l.recurring) }
	];

	// Capped so a fund that overshoots never renders a bar wider than its track.
	const pct = $derived(Math.min(100, Math.round((data.raisedKes / cashTotal) * 100)));
	const balance = $derived(data.raisedKes - spentTotal);

	// The right-hand stepper. Anchors match the section ids below.
	const toc = [
		{ id: 'raised', label: 'Where we are' },
		{ id: 'costs', label: 'What it costs' },
		{ id: 'given', label: 'Volunteered' },
		{ id: 'ledger', label: 'Where money went' },
		{ id: 'contributors', label: 'Contributors' }
	];

	let amount = $state(1000);
	const presets = [100, 1000, 5000, 50000];
</script>

<svelte:head>
	<title>Support the register · vote.ke</title>
	<meta
		name="description"
		content="vote.ke publishes who your leaders are and a dated record of what they say and do. It never rules on any of it. Here is what the register costs to run, and every shilling spent."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
	<header class="mb-8">
		<h1 class="text-3xl font-bold text-heading">Support the civic register</h1>
		
		<p class="text-xl mt-4 italic">vote.ke keeps a dated, public and permanent record of who our leaders are every day.</p>

		<p class="mt-3 text-lg text-muted">
			We track what our leaders say and what they do, and we publish it here. The register is free to use, <strong>and it is free of opinion</strong>. 
		</p>

		<p class="mt-3 text-lg text-muted">
			We do not rule that a report is true, that a statement is hate speech, or that a leader is corrupt. Those are
			findings for a court or for the NCIC. We only publish the record and how many separate verified people reported the same thing, in the same
			place, on the same day.
		</p>
	</header>

	<!-- The honest split: what already runs, and what money would add. Kept above
	the budget because a page asking for money should first say what exists. -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2">
		<div class="rounded-2xl border border-border bg-surface p-5">
			<p class="text-xs font-semibold tracking-wide text-muted uppercase">Running today, free</p>
			<ul class="mt-3 space-y-2 text-sm text-muted">
				<li><span class="font-medium text-heading">All elective seats.</span> Pages for all elective seats and 1,100+ current, past and aspiring officeholders.</li>
				<li><span class="font-medium text-heading">Voter guides.</span> <a href="/education">Resources</a> on why you should vote, how to register as a voter, how votes are counted, and your rights on the day of the election.</li>
				<li><span class="font-medium text-heading">Ballot simulator.</span> <a href="/ballot">Our ballot simulator</a> shows the six ballots you will be required to cast for your ward.</li>
				<li><span class="font-medium text-heading">Daily press monitoring.</span> Coverage gathered per leader every morning and attached to their page.</li>
				<li><span class="font-medium text-heading">Side-by-side comparison</span> of anyone contesting the same seat.</li>
			</ul>
		</div>
		<div class="rounded-2xl border border-border bg-surface-2 p-5">
			<p class="text-xs font-semibold tracking-wide text-muted uppercase">What we plan to build</p>
			<ul class="mt-3 space-y-2 text-sm text-muted">
				<li><span class="font-medium text-heading">Citizen reporting.</span> Text a shortcode. We check the number is real, work out the ward, attach it to the leader named, and publish it at a permanent address.</li>
				<li><span class="font-medium text-heading">A count, not a verdict.</span> Each report shows how many separate verified numbers, across how many wards, said the same thing.</li>
				<li><span class="font-medium text-heading">A county map</span> and a citable export, so a journalist, a petitioner or a court can quote a reference number.</li>
				<li><span class="font-medium text-heading">Coordinators in each county,</span> because reports come from people, not from software.</li>
			</ul>
			<p class="mt-3 text-xs text-muted">None of this exists yet. That is what the budget below is for.</p>
		</div>
	</div>

	<!-- Contribute, mobile placement: the sidebar stacks below the whole page on
	small screens, which would bury the form several scrolls down. -->
	<a
		href="#contribute"
		class="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-2 p-4 transition hover:border-primary lg:hidden"
	>
		<span>
			<span class="block font-semibold text-heading">Contribute to the register</span>
			<span class="mt-0.5 block text-sm text-muted">{kes(data.raisedKes)} raised of {kes(cashTotal)}</span>
		</span>
		<span class="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary">Give</span>
	</a>

	<div class="grid gap-10 lg:grid-cols-10">
		<!-- Main column -->
		<div class="space-y-10 lg:col-span-7">

			<h2 class="mt-2 text-xl font-bold text-heading">Who is behind this?</h2>
			<p class="rounded-2xl border border-border bg-surface-2 p-4 text-sm">
				This is a neutral civic educational and electoral preparedness platform voluntarily built by <a href="https://x.com/JusticeEngineer" class="text-primary hover:underline">@JusticeEngineer</a>.
				It is not affiliated with any political party or candidate. The mission is to improve our readiness for a safe and fair general election for 2027 and beyond.
				Each contribution is listed below by default, unless opted out. We welcome support from all who share our vision, including citizens, civil society, and the private sector. 
			</p>

			<section id="raised" class="scroll-mt-24 rounded-2xl border border-border bg-surface p-6">
				<h2 class="sr-only">Where we are</h2>
				<div class="flex flex-wrap items-end justify-between gap-2">
					<div>
						<div class="text-2xl font-bold text-heading">{kes(data.raisedKes)}</div>
						<div class="text-sm text-muted">raised of {kes(cashTotal)}</div>
					</div>
					<div class="text-sm text-muted">{pct}%</div>
				</div>
				<div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-3">
					<div class="h-full rounded-full bg-primary" style="width: {pct}%"></div>
				</div>
				<dl class="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
					<div><dt class="text-muted">Spent</dt><dd class="font-medium text-heading">{kes(spentTotal)}</dd></div>
					<div><dt class="text-muted">Balance</dt><dd class="font-medium text-heading">{kes(balance)}</dd></div>
					<div><dt class="text-muted">Pending</dt><dd class="font-medium text-heading">{kes(data.pendingKes)}</dd></div>
					<div><dt class="text-muted">Contributors</dt><dd class="font-medium text-heading">{data.contributors.length}</dd></div>
				</dl>
			</section>

			<section id="costs" class="scroll-mt-24">
				<h2 class="text-xl font-bold text-heading">What it costs</h2>
				<p class="mt-1 text-sm text-muted">
					Cash that actually leaves an account. This is the whole ask.
				</p>
				{#each groups as group (group.label)}
					{#if group.lines.length}
						<h3 class="mt-5 text-xs font-semibold tracking-wide text-muted uppercase">{group.label}</h3>
						<ul class="mt-2 divide-y divide-border">
							{#each group.lines as line (line.label)}
								<li class="flex flex-wrap justify-between gap-2 py-3 text-sm">
									<span class="min-w-0 flex-1">
										<span class="font-medium text-heading">{line.label}</span>
										<span class="mt-0.5 block text-muted">{line.note}</span>
									</span>
									<span class="shrink-0 font-medium text-heading">{kes(line.amount)}</span>
								</li>
							{/each}
						</ul>
					{/if}
				{/each}
				<p class="mt-4 border-t border-border pt-3 text-right text-sm font-semibold text-heading">
					Cash needed {kes(cashTotal)}
				</p>
			</section>

			<section id="given" class="scroll-mt-24 rounded-2xl border border-border bg-surface-2 p-6">
				<h2 class="text-xl font-bold text-heading">Volunteered Work</h2>
				<p class="mt-1 text-sm text-muted">
					Work given to the project, priced at what it would cost to buy. You are not being
					asked to pay for any of it. It is here so the true cost of the register is visible.
				</p>
				<ul class="mt-3 divide-y divide-border">
					{#each DONATED as line (line.label)}
						<li class="flex flex-wrap justify-between gap-2 py-3 text-sm">
							<span class="min-w-0 flex-1">
								<span class="font-medium text-heading">{line.label}</span>
								<span class="mt-0.5 block text-muted">{line.note}</span>
							</span>
							<span class="shrink-0 font-medium text-muted line-through">{kes(line.amount)}</span>
						</li>
					{/each}
				</ul>
				<p class="mt-4 border-t border-border pt-3 text-right text-sm font-semibold text-heading">
					Total volunteered: {kes(donatedTotal)}
				</p>
			</section>

			<section id="ledger" class="scroll-mt-24">
				<h2 class="text-xl font-bold text-heading">Where the money went</h2>
				<p class="mt-1 text-sm text-muted">
					Every payment out of this fund, as it happens. A project that asks leaders to keep
					a public record has no business hiding its own.
				</p>
				{#if SPENT.length === 0}
					<p class="mt-3 text-sm text-muted">Nothing spent yet.</p>
				{:else}
					<ul class="mt-3 divide-y divide-border">
						{#each SPENT as e (e.description)}
							<li class="flex flex-wrap justify-between gap-2 py-3 text-sm">
								<span>
									<span class="font-medium text-heading">{e.description}</span>
									<span class="mt-0.5 block text-muted">{e.on}</span>
								</span>
								<span class="shrink-0 font-medium text-heading">{kes(e.amount)}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</section>

			<section id="contributors" class="scroll-mt-24">
				<h2 class="text-xl font-bold text-heading">Contributors</h2>
				{#if data.contributors.length}
					<p class="mt-1 text-sm text-muted">Everyone who asked to be listed.</p>
					<ul class="mt-3 flex flex-wrap gap-2">
						{#each data.contributors as c, i (i)}
							<li class="rounded-full bg-surface-3 px-3 py-1 text-sm text-heading">{c.donorName}</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-1 text-sm text-muted">Nobody yet. The first name goes here.</p>
				{/if}
			</section>
		</div>

		<!-- rhs: the stepping contents, then the contribute form, both sticky on
		desktop so the ask stays reachable while the budget is being read -->
		<div class="space-y-6 lg:col-span-3">
			<div class="lg:sticky lg:top-20 lg:space-y-6">
				<nav class="hidden rounded-2xl border border-border bg-surface-2 p-4 lg:block" aria-label="On this page">
					<p class="text-xs font-semibold tracking-wide text-muted uppercase">On this page</p>
					<ol class="mt-2 space-y-1 text-sm">
						{#each toc as item, i (item.id)}
							<li>
								<a
									href="#{item.id}"
									class="flex gap-2 rounded-lg px-2 py-1.5 text-muted transition hover:bg-surface-3 hover:text-primary"
								>
									<span class="font-mono text-xs text-muted">{i + 1}</span>
									<span>{item.label}</span>
								</a>
							</li>
						{/each}
					</ol>
				</nav>

				<div id="contribute" class="scroll-mt-24 rounded-2xl border border-border bg-surface-2 p-4">
					<p class="text-xs font-semibold tracking-wide text-muted uppercase">Contribute</p>

					{#if form?.contributed}
						<p class="mt-3 rounded-xl bg-primary-soft p-3 text-sm text-on-primary dark:text-heading">
							{#if form.stk}
								Check your phone for an M-Pesa prompt for {kes(form.amount)}. Thank you.
							{:else}
								Recorded: {kes(form.amount)}. We will confirm it against the statement. Thank you.
							{/if}
						</p>
					{:else}
						<p class="mt-2 text-sm leading-relaxed text-muted">
							Any amount. This funds the register, not a candidate and not a party.
						</p>
						{#if form?.error}
							<p class="mt-3 rounded-xl bg-danger-soft p-3 text-sm text-danger">{form.error}</p>
						{/if}
						<form method="POST" action="?/contribute" use:enhance class="mt-3 space-y-3">
							<!-- Two-up preset grid: four full-width buttons would run the card
							long, and a single row is too tight in a 3-of-10 column. -->
							<div class="grid grid-cols-2 gap-2">
								{#each presets as p (p)}
									<button
										type="button"
										onclick={() => (amount = p)}
										class="rounded-xl border px-2 py-2 text-sm font-medium transition {amount === p
											? 'border-primary bg-primary text-on-primary'
											: 'border-border bg-surface text-muted hover:border-primary hover:text-primary'}"
									>
										{p.toLocaleString('en-KE')}
									</button>
								{/each}
							</div>
							<label class="block text-xs font-medium text-muted">
								Amount (KES)
								<input name="amount" type="number" min="10" bind:value={amount} class="mt-1 w-full rounded-xl text-sm" />
							</label>
							<label class="block text-xs font-medium text-muted">
								Your name
								<input name="donorName" required placeholder="Name" class="mt-1 w-full rounded-xl text-sm" />
							</label>
							<label class="block text-xs font-medium text-muted">
								M-Pesa number
								<input name="phone" placeholder="07xx xxx xxx" class="mt-1 w-full rounded-xl text-sm" />
							</label>
							<label class="flex items-start gap-2 text-xs text-muted">
								<input type="checkbox" name="isPublic" value="1" checked class="mt-0.5" />
								<span>List my name on this page</span>
							</label>
							<button
								class="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:brightness-95"
							>
								{data.mpesaLive ? 'Send M-Pesa prompt' : 'Record my contribution'}
							</button>
						</form>
					{/if}

					<p class="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted">
						If more is raised than the budget above, the surplus extends county coordinator
						coverage beyond the first ten counties and is listed here before it is spent. If
						less is raised, the shortcode and coordinator lines shrink first and the register
						still runs on the web and WhatsApp intake.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
