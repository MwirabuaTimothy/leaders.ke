<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`;
	// Grouped as an object array rather than a tuple: destructuring a tuple in an
	// {#each} widens both members to a union and loses the row type.
	const groups = $derived([
		{ label: 'One-off', lines: data.budget.filter((b) => !b.isRecurring) },
		{ label: 'Running costs', lines: data.budget.filter((b) => b.isRecurring) }
	]);
	const total = $derived(data.budget.reduce((n, b) => n + b.amountKes, 0));
	// Capped at 100 so a fund that overshoots its target does not render a bar
	// wider than its track.
	const pct = $derived(Math.min(100, Math.round((data.raisedKes / data.fund.targetKes) * 100)));

	let amount = $state(500);
	const presets = [200, 500, 1000, 5000];
</script>

<svelte:head>
	<title>Support the register · vote.ke</title>
	<meta
		name="description"
		content="Nobody is paid to build vote.ke's civic register. Here is what it costs to run, what has been raised, and what it was spent on."
	/>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<h1 class="text-3xl font-bold text-heading">{data.fund.name}</h1>
	<p class="mt-3 text-muted">{data.fund.summary}</p>

	<!-- The claim the whole page rests on, stated before any ask. -->
	<p class="mt-4 rounded-lg border border-border bg-surface-2 p-4 text-sm">
		<span class="font-semibold text-heading">Nobody is paid to build this.</span>
		The engineering is volunteered. Contributions cover running costs only, and every
		shilling out is listed below.
	</p>

	<!-- Raised -->
	<section class="mt-8 rounded-xl border border-border bg-surface p-6">
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

	<!-- Budget -->
	<section class="mt-8">
		<h2 class="text-xl font-bold text-heading">What it costs</h2>
		{#if data.budget.length === 0}
			<p class="mt-2 text-sm text-muted">The budget is being finalised and will be published here.</p>
		{:else}
			{#each groups as group (group.label)}
				{#if group.lines.length}
					<h3 class="mt-5 text-xs font-semibold tracking-wide text-muted uppercase">{group.label}</h3>
					<ul class="mt-2 divide-y divide-border">
						{#each group.lines as line (line.id)}
							<li class="flex flex-wrap justify-between gap-2 py-3 text-sm">
								<span class="min-w-0">
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
				Total {kes(total)}
			</p>
		{/if}
	</section>

	<!-- Ledger -->
	<section class="mt-8">
		<h2 class="text-xl font-bold text-heading">Where the money went</h2>
		<p class="mt-1 text-sm text-muted">
			Every payment out of this fund, as it happens. A register that asks for a public
			record should keep one about itself.
		</p>
		{#if data.expenses.length === 0}
			<p class="mt-3 text-sm text-muted">Nothing spent yet.</p>
		{:else}
			<ul class="mt-3 divide-y divide-border">
				{#each data.expenses as e (e.id)}
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

	<!-- Contribute -->
	<section class="mt-8 rounded-xl border border-border bg-surface p-6">
		<h2 class="text-xl font-bold text-heading">Contribute</h2>
		<p class="mt-1 text-sm text-muted">
			Anyone can, at any amount. This funds the register, not a candidate or a party.
		</p>

		{#if form?.contributed}
			<p class="mt-4 rounded-lg bg-primary-soft p-3 text-sm text-on-primary dark:text-heading">
				{#if form.stk}
					Check your phone for an M-Pesa prompt for {kes(form.amount)}. Thank you.
				{:else}
					Recorded: {kes(form.amount)}. We will confirm it against the statement. Thank you.
				{/if}
			</p>
		{:else}
			{#if form?.error}
				<p class="mt-4 rounded-lg bg-danger-soft p-3 text-sm text-danger">{form.error}</p>
			{/if}
			<form method="POST" action="?/contribute" use:enhance class="mt-4 space-y-3">
				<div class="flex flex-wrap gap-2">
					{#each presets as p (p)}
						<button
							type="button"
							onclick={() => (amount = p)}
							class="rounded-lg border px-3 py-1.5 text-sm {amount === p
								? 'border-primary bg-primary text-on-primary'
								: 'border-border hover:bg-surface-3'}"
						>
							{kes(p)}
						</button>
					{/each}
				</div>
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<label class="block text-sm">
						Amount (KES)
						<input name="amount" type="number" min="10" bind:value={amount} class="mt-1 w-full rounded-lg" />
					</label>
					<label class="block text-sm">
						Your name
						<input name="donorName" required placeholder="Name" class="mt-1 w-full rounded-lg" />
					</label>
					<label class="block text-sm">
						M-Pesa number
						<input name="phone" placeholder="07xx xxx xxx" class="mt-1 w-full rounded-lg" />
					</label>
				</div>
				<label class="flex items-center gap-2 text-sm">
					<input type="checkbox" name="isPublic" value="1" checked />
					List my name below
				</label>
				<button class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:brightness-95">
					{data.mpesaLive ? 'Send M-Pesa prompt' : 'Record my contribution'}
				</button>
			</form>
		{/if}

		{#if data.fund.surplusPolicy}
			<p class="mt-4 border-t border-border pt-3 text-xs text-muted">{data.fund.surplusPolicy}</p>
		{/if}
	</section>

	{#if data.contributors.length}
		<section class="mt-8">
			<h2 class="text-xl font-bold text-heading">Contributors</h2>
			<p class="mt-1 text-sm text-muted">Everyone who asked to be listed.</p>
			<ul class="mt-3 flex flex-wrap gap-2">
				{#each data.contributors as c, i (i)}
					<li class="rounded-full bg-surface-3 px-3 py-1 text-sm text-heading">{c.donorName}</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
