<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`;

	// Cash lines grouped as objects rather than tuples: destructuring a tuple in an
	// {#each} widens both members to a union and loses the row type.
	const groups = $derived([
		{ label: 'One-off', lines: data.budget.filter((b) => !b.isRecurring) },
		{ label: 'Running costs', lines: data.budget.filter((b) => b.isRecurring) }
	]);
	// Capped so a fund that overshoots its target never renders a bar wider than its track.
	const pct = $derived(Math.min(100, Math.round((data.raisedKes / data.fund.targetKes) * 100)));

	// The right-hand stepper. Anchors match the section ids below.
	const toc = [
		{ id: 'raised', label: 'Where we are' },
		{ id: 'costs', label: 'What it costs' },
		{ id: 'given', label: 'What is donated' },
		{ id: 'ledger', label: 'Where money went' },
		{ id: 'contributors', label: 'Contributors' }
	];

	let amount = $state(500);
	const presets = [200, 500, 1000, 5000];
</script>

<svelte:head>
	<title>Support the register · vote.ke</title>
	<meta
		name="description"
		content="Nobody is paid to build vote.ke's civic register. Here is what it costs to run, what is donated, what has been raised, and what it was spent on."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
	<header class="mb-8">
		<h1 class="text-3xl font-bold text-heading">{data.fund.name}</h1>
		<p class="mt-3 max-w-3xl text-muted">{data.fund.summary}</p>
	</header>

	<!-- Contribute, mobile placement: the sidebar stacks below the whole page on
	small screens, which would bury the form several scrolls down. -->
	<a
		href="#contribute"
		class="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-2 p-4 transition hover:border-primary lg:hidden"
	>
		<span>
			<span class="block font-semibold text-heading">Contribute to the register</span>
			<span class="mt-0.5 block text-sm text-muted">{kes(data.raisedKes)} raised of {kes(data.fund.targetKes)}</span>
		</span>
		<span class="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary">Give</span>
	</a>

	<div class="grid gap-10 lg:grid-cols-10">
		<!-- Main column -->
		<div class="space-y-10 lg:col-span-7">
			<p class="rounded-2xl border border-border bg-surface-2 p-4 text-sm">
				<span class="font-semibold text-heading">Nobody is paid to build this.</span>
				The engineering is volunteered. Contributions cover running costs only, and every
				shilling out is listed below.
			</p>

			<section id="raised" class="scroll-mt-24 rounded-2xl border border-border bg-surface p-6">
				<h2 class="sr-only">Where we are</h2>
				<div class="flex flex-wrap items-end justify-between gap-2">
					<div>
						<div class="text-2xl font-bold text-heading">{kes(data.raisedKes)}</div>
						<div class="text-sm text-muted">raised of {kes(data.fund.targetKes)}</div>
					</div>
					<div class="text-sm text-muted">{pct}%</div>
				</div>
				<div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-3">
					<div class="h-full rounded-full bg-primary" style="width: {pct}%"></div>
				</div>
				<dl class="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
					<div><dt class="text-muted">Spent</dt><dd class="font-medium text-heading">{kes(data.spentKes)}</dd></div>
					<div><dt class="text-muted">Balance</dt><dd class="font-medium text-heading">{kes(data.balanceKes)}</dd></div>
					<div><dt class="text-muted">Pending</dt><dd class="font-medium text-heading">{kes(data.pendingKes)}</dd></div>
					<div><dt class="text-muted">Contributors</dt><dd class="font-medium text-heading">{data.contributors.length}</dd></div>
				</dl>
			</section>

			<section id="costs" class="scroll-mt-24">
				<h2 class="text-xl font-bold text-heading">What it costs</h2>
				<p class="mt-1 text-sm text-muted">Cash that actually leaves an account. This is the whole ask.</p>
				{#if data.budget.length === 0}
					<p class="mt-3 text-sm text-muted">The budget is being finalised and will be published here.</p>
				{:else}
					{#each groups as group (group.label)}
						{#if group.lines.length}
							<h3 class="mt-5 text-xs font-semibold tracking-wide text-muted uppercase">{group.label}</h3>
							<ul class="mt-2 divide-y divide-border">
								{#each group.lines as line (line.label)}
									<li class="flex flex-wrap justify-between gap-2 py-3 text-sm">
										<span class="min-w-0 flex-1">
											<span class="font-medium text-heading">{line.label}</span>
											{#if line.note}<span class="mt-0.5 block text-muted">{line.note}</span>{/if}
										</span>
										<span class="shrink-0 font-medium text-heading">{kes(line.amountKes)}</span>
									</li>
								{/each}
							</ul>
						{/if}
					{/each}
					<p class="mt-4 border-t border-border pt-3 text-right text-sm font-semibold text-heading">
						Cash needed {kes(data.cashTotalKes)}
					</p>
				{/if}
			</section>

			<!-- The in-kind half. Shown at market rate so the real cost of the project
			is visible, and excluded from the target so the "nobody is paid" claim holds. -->
			{#if data.volunteered.length}
				<section id="given" class="scroll-mt-24 rounded-2xl border border-border bg-surface-2 p-6">
					<h2 class="text-xl font-bold text-heading">What is donated, not billed</h2>
					<p class="mt-1 text-sm text-muted">
						Work given to the project, priced at what it would cost to buy. You are not being
						asked to pay for any of it. It is here so the true cost of the register is visible.
					</p>
					<ul class="mt-3 divide-y divide-border">
						{#each data.volunteered as line (line.label)}
							<li class="flex flex-wrap justify-between gap-2 py-3 text-sm">
								<span class="min-w-0 flex-1">
									<span class="font-medium text-heading">{line.label}</span>
									{#if line.note}<span class="mt-0.5 block text-muted">{line.note}</span>{/if}
								</span>
								<span class="shrink-0 font-medium text-muted line-through">{kes(line.amountKes)}</span>
							</li>
						{/each}
					</ul>
					<p class="mt-4 border-t border-border pt-3 text-right text-sm font-semibold text-heading">
						Donated {kes(data.volunteeredKes)}
					</p>
					<p class="mt-3 text-sm text-muted">
						Full cost of the register is {kes(data.projectTotalKes)}. Volunteered labour covers
						{Math.round((data.volunteeredKes / data.projectTotalKes) * 100)}% of it, so the public ask is
						{kes(data.cashTotalKes)}.
					</p>
				</section>
			{/if}

			<section id="ledger" class="scroll-mt-24">
				<h2 class="text-xl font-bold text-heading">Where the money went</h2>
				<p class="mt-1 text-sm text-muted">
					Every payment out of this fund, as it happens. A register that asks for a public
					record should keep one about itself.
				</p>
				{#if data.expenses.length === 0}
					<p class="mt-3 text-sm text-muted">Nothing spent yet.</p>
				{:else}
					<ul class="mt-3 divide-y divide-border">
						{#each data.expenses as e (e.description)}
							<li class="flex flex-wrap justify-between gap-2 py-3 text-sm">
								<span>
									<span class="font-medium text-heading">{e.description}</span>
									<span class="mt-0.5 block text-muted">{e.spentOn}</span>
								</span>
								<span class="shrink-0 font-medium text-heading">{kes(e.amountKes)}</span>
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
							Any amount. This funds the register, not a candidate or a party.
						</p>
						{#if form?.error}
							<p class="mt-3 rounded-xl bg-danger-soft p-3 text-sm text-danger">{form.error}</p>
						{/if}
						<form method="POST" action="?/contribute" use:enhance class="mt-3 space-y-3">
							<!-- Two-up preset grid: four full-width buttons would run the
							card long, and a single row is too tight in a 3-of-10 column. -->
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

					{#if data.fund.surplusPolicy}
						<p class="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted">
							{data.fund.surplusPolicy}
						</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
