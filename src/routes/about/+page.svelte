<script lang="ts">
	// Absorbed the register content from the retired /support page. Solid borders
	// mark what runs today, dashed borders what does not exist yet, so the two
	// lists never get read as one promise.
	import Countdown from '$lib/components/Countdown.svelte';

	const stats = [
		{ n: '1,478', l: 'leaders on the register' },
		{ n: '1,882', l: 'elective seats mapped' },
		{ n: '131', l: 'political parties' },
		{ n: '47', l: 'counties, down to ward' }
	];

	const running = [
		{
			t: 'All elective seats',
			d: 'Pages for every elective seat and 1,478 current, past and aspiring officeholders.',
			href: '/presidents'
		},
		{
			t: 'Voter guides',
			d: 'Why to vote, how to register, how votes are counted, and your rights on the day.',
			href: '/education'
		},
		{
			t: 'Ballot simulator',
			d: 'The six ballots you will be required to cast for your ward.',
			href: '/ballot'
		},
		{
			t: 'Daily press monitoring',
			d: 'Coverage gathered per leader every morning and attached to their page.',
			href: '/'
		},
		{
			t: 'Side-by-side comparison',
			d: 'Anyone contesting the same seat, compared on one screen.',
			href: '/compare'
		}
	];

	const planned = [
		{
			t: 'Citizen reporting',
			d: 'Text a shortcode. We check the number is real, work out the ward, attach it to the leader named, and publish it at a permanent address.'
		},
		{
			t: 'A count, not a verdict',
			d: 'Each report shows how many separate verified numbers, across how many wards, said the same thing.'
		},
		{
			t: 'A county map and a citable export',
			d: 'So a journalist, a petitioner or a court can quote a reference number.'
		},
		{
			t: 'Coordinators in each county',
			d: 'Because reports come from people, not from software.'
		}
	];

	const stands = [
		{
			t: 'For voters',
			d: 'Land on the homepage and see what your leaders are doing today, then step into the booth: pick your county, constituency and ward, see every candidate across all six elective levels, cast a simulated ballot and share it. Around the booth sits non-partisan voter education, registration drives, key IEBC dates and side-by-side comparison. All of it is free.'
		},
		{
			t: 'For leaders',
			d: 'Every leader gets a verified public page: their record, manifesto, contacts and delivery tracker. On top of it sits the campaign toolkit, followers and ward-targeted broadcasts, reviews and vote pledges, fundraising, a press desk, and agentic AI that answers constituents from the campaign’s own material. One flat rate per package, whatever office you seek.'
		},
		{
			t: 'Where we stand',
			d: 'With every voter and every leader equally. vote.ke is party-neutral by design: verification is against IEBC records, the same tools at the same price are available to every campaign, voter education never carries paid placement, and citizens’ political choices are never shared, in line with the Data Protection Act (2019).'
		}
	];
</script>

<svelte:head>
	<title>About Us · vote.ke</title>
	<meta
		name="description"
		content="What vote.ke is, who builds it, what runs today and what is planned."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
	<!-- ── Hero: thesis left, the register in numbers right ────── -->
	<header class="grid gap-8 border-b border-border pb-10 lg:grid-cols-5">
		<div class="lg:col-span-3">
			<p class="text-xs font-semibold tracking-[0.2em] text-primary uppercase">About</p>
			<h1 class="mt-3 text-4xl font-bold tracking-tight text-heading sm:text-5xl">
				Know your leaders and practise your vote
			</h1>
			<p class="mt-5 text-xl leading-relaxed text-heading italic">
				vote.ke keeps a dated, public and permanent record of who our leaders are every day.
			</p>
			<p class="mt-4 max-w-2xl text-base leading-relaxed text-muted">
				Kenya's voting booth on the internet: one place for citizens to practise their 2027 ballot,
				learn how elections work and study the leaders asking for their vote, and one place for
				those leaders to run a modern campaign.
			</p>
		</div>

		<aside class="rounded-2xl border border-border bg-surface-2 p-6 lg:col-span-2">
			<h2 class="text-xs font-semibold tracking-[0.18em] text-muted uppercase">The register today</h2>
			<dl class="mt-4 grid grid-cols-2 gap-5">
				{#each stats as s (s.l)}
					<div>
						<dt class="text-2xl font-bold tracking-tight text-heading">{s.n}</dt>
						<dd class="mt-0.5 text-xs leading-snug text-muted">{s.l}</dd>
					</div>
				{/each}
			</dl>
			<div class="mt-5 border-t border-border pt-4 text-center">
				<p class="text-xs font-semibold tracking-wide text-muted uppercase">Countdown to the vote</p>
				<div class="mt-2"><Countdown /></div>
			</div>
		</aside>
	</header>

	<!-- ── The neutrality statement, given room ────────────────── -->
	<section class="mt-12 grid gap-8 lg:grid-cols-3">
		<h2 class="text-2xl font-bold text-heading sm:text-3xl">
			We publish the record. We never rule on it.
		</h2>
		<p class="text-base leading-relaxed text-muted lg:col-span-2">
			We track what our leaders say and what they do, and we publish it here. The register is free
			to use, <strong class="font-semibold text-heading">and it is free of opinion</strong>. We do
			not rule that a report is true, that a statement is hate speech, or that a leader is corrupt.
			Those are findings for a court or for the NCIC. We only publish the record, and how many
			separate verified people reported the same thing, in the same place, on the same day.
		</p>
	</section>

	<!-- ── Running today: solid borders, five across ───────────── -->
	<section class="mt-14">
		<div class="flex flex-wrap items-baseline justify-between gap-3">
			<h2 class="text-2xl font-bold text-heading sm:text-3xl">Running today, free</h2>
			<p class="text-sm text-muted">Live now, and free for every citizen.</p>
		</div>
		<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
			{#each running as r (r.t)}
				<a
					href={r.href}
					class="flex flex-col rounded-2xl border border-border bg-surface p-5 transition hover:border-primary"
				>
					<span class="flex items-center gap-2">
						<span class="h-1.5 w-1.5 rounded-full bg-primary"></span>
						<span class="text-sm font-bold text-heading">{r.t}</span>
					</span>
					<span class="mt-2 text-sm leading-relaxed text-muted">{r.d}</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- ── Planned: dashed borders, four across ────────────────── -->
	<section class="mt-12">
		<div class="flex flex-wrap items-baseline justify-between gap-3">
			<h2 class="text-2xl font-bold text-heading sm:text-3xl">What we plan to build</h2>
			<p class="text-sm text-muted">None of this exists yet.</p>
		</div>
		<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each planned as p (p.t)}
				<div class="flex flex-col rounded-2xl border border-dashed border-border bg-surface-2 p-5">
					<h3 class="text-sm font-bold text-heading">{p.t}</h3>
					<p class="mt-2 text-sm leading-relaxed text-muted">{p.d}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── Who is behind it ────────────────────────────────────── -->
	<section
		class="mt-14 flex flex-col justify-between gap-6 rounded-2xl border border-border bg-surface-2 p-8 lg:flex-row lg:items-center"
	>
		<div class="max-w-3xl">
			<h2 class="text-xl font-bold text-heading sm:text-2xl">Who is behind this</h2>
			<p class="mt-3 text-base leading-relaxed text-muted">
				A neutral civic educational and electoral preparedness platform, voluntarily built by
				<span class="font-semibold text-heading">Timothy Mwirabua</span>. It is not affiliated with
				any political party or candidate. The mission is to improve our readiness for a safe and
				fair general election in 2027 and beyond.
			</p>
		</div>
		<div class="flex shrink-0 flex-wrap gap-3">
			<a
				href="https://linkedin.com/in/MwirabuaTim"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-on-primary"
				>LinkedIn</a
			>
			<a
				href="https://x.com/MwirabuaTim"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-on-primary"
				>@MwirabuaTim</a
			>
		</div>
	</section>

	<!-- ── Three positions, three columns ──────────────────────── -->
	<section class="mt-14 grid gap-8 border-t border-border pt-10 lg:grid-cols-3">
		{#each stands as s (s.t)}
			<div>
				<h2 class="text-xl font-bold text-heading">{s.t}</h2>
				<p class="mt-3 text-sm leading-relaxed text-muted">{s.d}</p>
			</div>
		{/each}
	</section>

	<!-- ── Contact band ────────────────────────────────────────── -->
	<section
		class="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl border border-primary px-8 py-8 lg:flex-row lg:items-center"
	>
		<div>
			<h2 class="text-xl font-bold text-heading sm:text-2xl">Talk to us</h2>
			<p class="mt-2 text-sm leading-relaxed text-muted">
				Questions, corrections, or partnerships. Corrections to any leader's record are welcome and
				acted on.
			</p>
		</div>
		<a
			href="/contact-us"
			class="shrink-0 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
			>Contact us</a
		>
	</section>
</div>
