<script lang="ts">
	// Acquisition page. The asset is four things (domain, data, engine, audience)
	// and three very different buyers want different combinations, so the page is
	// structured by buyer rather than by feature. Each buyer block runs the same
	// shape: audience label, thesis, argument beside a pull-quote, then the four
	// reasons as a full-width card row.
	import Countdown from '$lib/components/Countdown.svelte';

	const stats = [
		{ n: '1,478', l: 'leader profiles' },
		{ n: '1,882', l: 'positions with track records' },
		{ n: '5,185', l: 'news articles classified' },
		{ n: '3,216', l: 'pages indexed by Google' },
		{ n: '131', l: 'political parties mapped' },
		{ n: '47', l: 'counties, down to ward level' }
	];

	const included = [
		{
			t: 'The domain',
			d: 'vote.ke. Two syllables, exact match, no explanation needed on a poster, a radio ad or a ballot. There is no second one of these.'
		},
		{
			t: 'The database',
			d: 'Every elective seat in Kenya, every party, and 1,478 leaders with their positions, experience and delivery records. Assembled over months, not scraped in a weekend.'
		},
		{
			t: 'The engine',
			d: 'A working platform: daily news ingestion with AI sentiment classification, ward-level geography, ballot simulation, M-Pesa payments, SMS broadcast and a verification pipeline.'
		},
		{
			t: 'The audience',
			d: 'Roughly 128 Kenyans a day still arrive at vote.ke, and they kept arriving after the site went quiet. That is intent nobody had to buy.'
		}
	];

	const buyers = [
		{
			audience: 'For civic technology and accountability organisations',
			thesis: 'Skip the eighteen months you would otherwise spend building the boring half',
			lead: [
				'Every accountability platform in this region dies the same way. A grant funds the build, the build consumes the grant, and the data goes stale between cycles because nobody funds maintenance. The mission was never the problem. The plumbing was.',
				'If your mandate is civic transparency, the honest calculation is this: what would it cost you to build and populate this, and how much of that budget would be left for the actual work?'
			],
			quote: 'The plumbing already exists here, and it is populated.',
			points: [
				{
					t: 'A living record, not an archive',
					d: '1,478 leaders with positions, experience and delivery tracking. The news engine ingests and classifies mentions daily, so the record updates itself between elections instead of decaying.'
				},
				{
					t: 'Search already sends you people',
					d: '3,216 pages indexed, and citizens still arrive daily on their own. Accountability work that nobody reads is a report. This is a destination.'
				},
				{
					t: 'Built to the Data Protection Act',
					d: 'Party neutrality, verification and IEBC compliance were design constraints from day one, not retrofits. That is the part funders audit and the part that is expensive to add later.'
				},
				{
					t: 'It arrives as evidence, not a proposal',
					d: 'A 2027-cycle grant application backed by a live platform with real traffic is a different document from one backed by a wireframe.'
				}
			]
		},
		{
			audience: 'For pollsters and research firms',
			thesis:
				'A standing panel of politically engaged Kenyans, and a sentiment instrument nobody else has',
			lead: [
				'Your two hardest costs are recruitment and reach. Online panels in Kenya are thin, phone samples skew, and field work is expensive per respondent. Meanwhile the people you most want to sample are the ones who voluntarily research candidates online, and they are already here.',
				'The 2027 polling season is commissioned in 2026. Owning the instrument before the season starts is worth more than renting reach during it.'
			],
			quote: 'A tracking instrument that costs nothing per response.',
			points: [
				{
					t: 'Ward-level geography, already structured',
					d: 'All 47 counties down to ward, mapped to every elective seat. Your sampling frame and your cross-tabs are the same object.'
				},
				{
					t: 'Ballot simulation is revealed preference',
					d: 'Visitors cast a practice ballot across all six elective levels. Not a stated intention captured by an enumerator, but a choice made privately, with geography attached.'
				},
				{
					t: 'A recruitment funnel that runs itself',
					d: 'Organic search brings politically engaged Kenyans daily. Converting a fraction of them into a consented panel is cheaper than any field recruitment you currently run.'
				},
				{
					t: 'Publishable by design',
					d: 'Party-neutral, compliant, and defensible in a press release. A poll is only as credible as its instrument.'
				}
			]
		},
		{
			audience: 'For an aspirant or a campaign',
			thesis: 'Own the place where voters go to check on you',
			lead: [
				'Campaign websites are built in a hurry, live for eight months, and are forgotten the week after the vote. They cost real money and reach the people who already support you. This is a different kind of asset.',
				'Turn vote.ke into a partisan site and the traffic and trust evaporate within a cycle. Fund it, keep it independent, and be the leader who paid for Kenya’s civic infrastructure.'
			],
			quote: 'A better story than a campaign page, and it survives the election either way.',
			points: [
				{
					t: 'A domain that ends the argument',
					d: 'vote.ke on a billboard, a t-shirt, a reflector or a radio spot needs no explanation and no spelling out. Ask what it costs to make a made-up campaign URL memorable.'
				},
				{
					t: 'The campaign toolkit is already built',
					d: 'Ward-targeted SMS broadcast, follower lists, vote pledges, M-Pesa fundraising with a double-entry ledger, a press desk, and an AI assistant that answers constituents from your own material.'
				},
				{
					t: 'An audience that is not yours yet',
					d: 'Every channel you own preaches to people who already follow you. This one brings undecided voters who came to research, which is the only audience worth reaching.'
				},
				{
					t: 'The credible play is to keep it neutral',
					d: 'Independence is what makes the traffic worth having. Buying it and branding it destroys the thing you paid for.'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>Buy vote.ke</title>
	<meta
		name="description"
		content="Kenya's civic data platform: 1,478 leader profiles, 3,216 indexed pages, a live news engine and the vote.ke domain. Available before the 2027 cycle."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
	<!-- ── Hero: argument left, contents manifest right ────────── -->
	<header class="grid gap-8 border-b border-border pb-10 lg:grid-cols-5">
		<div class="lg:col-span-3">
			<p class="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Acquisition</p>
			<h1 class="mt-3 text-4xl font-bold tracking-tight text-heading sm:text-5xl lg:text-6xl">
				vote.ke is for sale
			</h1>
			<p class="mt-5 text-lg leading-relaxed text-muted">
				Kenya's civic data platform, the domain that names it, and the audience that already found
				it. Built through 2026, populated, indexed, and available now rather than in the panic of
				election year.
			</p>
			<div class="mt-7 flex flex-wrap items-center gap-4">
				<a
					href="/contact-us"
					class="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
				>
					Start a conversation
				</a>
				<span class="text-sm text-muted">Full data room on request.</span>
			</div>
		</div>

		<aside class="rounded-2xl border border-border bg-surface-2 p-6 lg:col-span-2">
			<h2 class="text-xs font-semibold tracking-[0.18em] text-muted uppercase">In the sale</h2>
			<ul class="mt-4 divide-y divide-border">
				{#each included as i (i.t)}
					<li class="flex items-baseline gap-3 py-2.5">
						<span class="text-primary">&#9679;</span>
						<span class="text-sm font-semibold text-heading">{i.t}</span>
					</li>
				{/each}
			</ul>
			<div class="mt-4 border-t border-border pt-4 text-center">
				<p class="text-xs font-semibold tracking-wide text-muted uppercase">Countdown to the vote</p>
				<div class="mt-2"><Countdown /></div>
			</div>
		</aside>
	</header>

	<!-- ── Numbers: six across, full bleed of the container ────── -->
	<section class="mt-12">
		<h2 class="text-xs font-semibold tracking-[0.18em] text-muted uppercase">What exists today</h2>
		<dl
			class="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6"
		>
			{#each stats as s (s.l)}
				<div class="bg-surface p-6">
					<dt class="text-3xl font-bold tracking-tight text-heading lg:text-4xl">{s.n}</dt>
					<dd class="mt-1.5 text-sm leading-snug text-muted">{s.l}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<!-- ── Four assets: four across ────────────────────────────── -->
	<section class="mt-14">
		<h2 class="text-2xl font-bold text-heading sm:text-3xl">Four assets, sold together</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each included as i (i.t)}
				<div class="flex flex-col rounded-2xl border border-border bg-surface-2 p-6">
					<h3 class="text-lg font-semibold text-heading">{i.t}</h3>
					<p class="mt-2.5 text-sm leading-relaxed text-muted">{i.d}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── The three buyers ────────────────────────────────────── -->
	{#each buyers as b, idx (b.audience)}
		<section class="mt-16 border-t border-border pt-10">
			<h2 class="text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl">
				{b.audience}
			</h2>
			<p class="mt-3 max-w-4xl text-xl font-semibold text-heading sm:text-2xl">{b.thesis}</p>

			<!-- argument beside a pull-quote; the quote alternates side by section -->
			<div class="mt-7 grid gap-6 lg:grid-cols-3">
				<div
					class="space-y-4 text-base leading-relaxed text-muted lg:col-span-2 {idx === 1
						? 'lg:order-2'
						: ''}"
				>
					{#each b.lead as para (para)}
						<p>{para}</p>
					{/each}
				</div>
				<aside
					class="flex items-center rounded-2xl border-l-4 border-primary bg-surface-2 px-6 py-7 {idx ===
					1
						? 'lg:order-1'
						: ''}"
				>
					<p class="text-lg leading-snug font-semibold text-heading">{b.quote}</p>
				</aside>
			</div>

			<!-- the four reasons, four across -->
			<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each b.points as pt (pt.t)}
					<div class="flex flex-col rounded-2xl border border-border bg-surface p-5">
						<h3 class="text-sm font-bold text-heading">{pt.t}</h3>
						<p class="mt-2 text-sm leading-relaxed text-muted">{pt.d}</p>
					</div>
				{/each}
			</div>
		</section>
	{/each}

	<!-- ── Timing ──────────────────────────────────────────────── -->
	<section class="mt-16 rounded-2xl border border-border bg-surface-2 p-8 sm:p-10">
		<div class="grid gap-8 lg:grid-cols-3">
			<h2 class="text-2xl font-bold text-heading sm:text-3xl">Why now, and not in 2027</h2>
			<p class="text-base leading-relaxed text-muted">
				This asset has a clock on it. Its value rises through the 2027 cycle and falls sharply the
				week after the vote. Everyone who wants it will want it at the same time, and by then the
				price reflects that.
			</p>
			<p class="text-lg leading-snug font-semibold text-heading">
				Buying early buys the one thing an election cannot give you back: time to make it yours
				before it matters.
			</p>
		</div>
	</section>

	<!-- ── CTA: full-width band ────────────────────────────────── -->
	<section
		class="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary px-8 py-10 lg:flex-row lg:items-center"
	>
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold text-heading sm:text-3xl">Let us talk</h2>
			<p class="mt-3 text-base leading-relaxed text-muted">
				Tell us which of the four assets matter to you and we will put together the relevant
				numbers: traffic history, the data schema, the codebase, and what a transfer would involve.
			</p>
		</div>
		<a
			href="/contact-us"
			class="shrink-0 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-on-primary transition hover:opacity-90"
		>
			Start a conversation
		</a>
	</section>
</div>
