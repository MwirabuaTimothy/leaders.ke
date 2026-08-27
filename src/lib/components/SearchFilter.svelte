<script lang="ts">
	import { counties } from '$lib/data/geo';

	let {
		lockTitle,
		regions,
		parties,
		region = $bindable(''),
		party = $bindable(''),
		hasFilters,
		onClear
	}: {
		lockTitle: string;
		regions: string[];
		parties: string[];
		region?: string;
		party?: string;
		hasFilters: boolean;
		onClear: () => void;
	} = $props();

	const pillSelect =
		'rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-heading focus:border-primary focus:ring-0 focus:ring-ring focus:outline-none';

	// MCA seats are wards (1,450 of them), too many to pick directly, so filter by
	// constituency instead; the caller matches each MCA leader by their ward's
	// parent constituency. Only constituencies that actually have a listed MCA show.
	const allConstituencies = counties
		.flatMap((c) => c.constituencies)
		.toSorted((a, b) => a.seatName.localeCompare(b.seatName));

	const constituencyOptions = $derived(
		allConstituencies.filter((c) => c.wards.some((w) => regions.includes(w.seatName)))
	);
</script>

{#if lockTitle === 'MCA'}
	<select bind:value={region} class={pillSelect} aria-label="Constituency">
		<option value="">All constituencies</option>
		{#each constituencyOptions as c (c.seatName)}
			<option value={c.seatName}>{c.seatName}</option>
		{/each}
	</select>
{:else if lockTitle === 'MP'}
	<select bind:value={region} class={pillSelect} aria-label="Constituency">
		<option value="">All constituencies</option>
		{#each regions as r (r)}
			<option value={r}>{r}</option>
		{/each}
	</select>
{:else if lockTitle !== 'President'}
	<select bind:value={region} class={pillSelect} aria-label="County">
		<option value="">All counties</option>
		{#each regions as r (r)}
			<option value={r}>{r}</option>
		{/each}
	</select>
{/if}

<select bind:value={party} class={pillSelect} aria-label="Party">
	<option value="">All parties</option>
	{#each parties as p (p)}
		<option value={p}>{p}</option>
	{/each}
</select>

{#if hasFilters}
	<button
		type="button"
		onclick={onClear}
		class="px-2 py-2 text-sm font-medium text-muted transition hover:text-heading"
	>
		Clear
	</button>
{/if}
