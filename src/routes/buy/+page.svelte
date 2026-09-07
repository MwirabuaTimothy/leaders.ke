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
			t: 'The brand',
			d: 'The clean vote.ke domain and all rights to the brand. Two syllables, exact match, no explanation needed on a cap, a t-shirt, a poster, a billboard or a radio ad. There is no second one of these.'
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

	// Kenya votes on the second Tuesday of August every five years. The asset does
	// not expire with a cycle, it compounds across them, which is the argument the
	// timeline below is making.
	const cycles = [
		{ y: '2027', n: 'General election', now: true },
		{ y: '2032', n: 'General election', now: false },
		{ y: '2037', n: 'General election', now: false },
		{ y: '2042', n: 'General election', now: false }
	];

	// What the next owner unlocks. Each of these is cheap here and expensive from
	// scratch, because the geography, the seat structure and the traffic already
	// exist. Framed as headroom, not as roadmap promises.
	const superpowers = [
		{
			t: 'USSD and SMS access',
			d: 'Most Kenyan voters are not on a smartphone. Every leader and seat is already keyed to a ward, so a shortcode turns this into the only civic register reachable from a feature phone.'
		},
		{
			t: 'Election-night results',
			d: 'The seat structure for all six elective levels is already modelled. Plug a results feed into it and vote.ke becomes the live results destination, on the domain people would guess first.'
		},
		{
			t: 'Ward-level sentiment tracking',
			d: 'The news engine already classifies every mention by tone. Surfacing it as a live county and ward dashboard is a view over data that is already being collected daily.'
		},
		{
			t: 'Promise-to-delivery scoring',
			d: 'Manifestos in, delivery tracker already built. Score what was promised against what the record shows was done, per leader, per cycle, automatically.'
		},
		{
			t: 'Swahili and vernacular',
			d: 'The content layer is structured rather than hand-written, so reaching a far larger share of the electorate is a translation problem and not a rebuild.'
		},
		{
			t: 'A newsroom API',
			d: '3,216 pages of structured civic data that every media house in the country rebuilds from scratch each cycle. Licensing it is a second revenue line that costs nothing to serve.'
		}
	];

	// Three numbers, in order: what it cost to build, what it can earn in one
	// cycle, and the ask sitting between them. Every figure below is one
	// multiplication a skimmer can redo in their head.
	const built = [
		{ m: 'Civic data model and geography', d: '47 counties down to ward, all six elective levels, 1,882 positions' },
		{ m: 'Leader profiles and track records', d: '1,478 profiles with experience, delivery tracking and verification' },
		{ m: 'News ingestion and AI classification', d: 'Daily crawl across 1,163 leaders, sentiment classified, 5,185 articles' },
		{ m: 'Ballot simulator and comparison', d: 'Six ballots per ward, shareable, side-by-side candidate view' },
		{ m: 'Campaign dashboard', d: 'Followers, broadcasts, pledges, reviews, ambassadors, press desk' },
		{ m: 'Payments and ledger', d: 'M-Pesa STK push, Paystack, credit wallets, double-entry accounting' },
		{ m: 'SMS, OTP and notifications', d: "Africa's Talking, number verification, ward-targeted delivery" },
		{ m: 'Voter education and party data', d: '131 parties, alliances, registration drives, key dates, demographics' },
		{ m: 'Programmatic SEO', d: '3,216 pages generated and indexed, sitemap, structured metadata' },
		{ m: 'Data assembly and verification', d: '36 import and backfill scripts; every profile, seat and party checked' },
		{ m: 'Design system and mobile layouts', d: 'Tokens, components, responsive down to 375px, accessibility pass' }
	];

	// Build cost, kept to one multiplication anyone can redo:
	// 60 days x 8 hours x 3 disciplines x KES 10,000.
	const DAYS = 60;
	const HOURS_PER_DAY = 8;
	const DISCIPLINES = 3;
	const RATE = 10_000;
	const buildTotal = DAYS * HOURS_PER_DAY * DISCIPLINES * RATE;

	// Rate card live on /pricing. The blended figure is derived from this table
	// rather than asserted, so the page and the maths can never drift apart.
	const tiers = [
		{ name: 'Kickstart', price: 2_500, share: 0.75 },
		{ name: 'Mobilize', price: 12_500, share: 0.2 },
		{ name: 'Dominate', price: 50_000, share: 0.05 }
	];
	const ARPU = tiers.reduce((a, t) => a + t.price * t.share, 0);
	const cases = [
		{ c: 'Bear', subs: 500, pct: '2%', note: 'The motion stalls early' },
		{ c: 'Base', subs: 1_250, pct: '5%', note: 'Steady founder-led selling' },
		{ c: 'Bull', subs: 2_500, pct: '10%', note: 'One party signs in bulk' }
	];
	const cycle = (subs: number) => subs * ARPU * 12;
	const ASK = Math.round(cycle(500) * 0.75);
	const HEADROOM = cycle(500) - ASK;
	const USD = Math.round(ASK / 130 / 1000) * 1000;
	const kes = (n: number) => n.toLocaleString('en-KE');

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
				it. Populated, indexed, and built for every election season Kenya will ever hold, not just
				the next one.
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

	<!-- ── Perpetual value, then urgency ───────────────────────── -->
	<section class="mt-16 rounded-2xl border border-border bg-surface-2 p-8 sm:p-10">
		<h2 class="text-2xl font-bold text-heading sm:text-3xl lg:text-4xl">
			This is not a 2027-only asset. It is an every-election asset.
		</h2>
		<p class="mt-4 max-w-4xl text-lg leading-relaxed text-muted">
			Kenya votes on the second Tuesday of August every five years, and by-elections run
			continuously in between. A civic record does not expire with a cycle. It compounds across
			them, and it is the only asset here that gets more valuable the longer it is held.
		</p>

		<!-- The cycle timeline -->
		<div class="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
			{#each cycles as c (c.y)}
				<div class="bg-surface p-6 {c.now ? 'border-t-4 border-primary' : ''}">
					<p class="text-3xl font-bold tracking-tight {c.now ? 'text-primary' : 'text-heading'}">
						{c.y}
					</p>
					<p class="mt-1 text-sm text-muted">{c.n}</p>
					{#if c.now}
						<p class="mt-2 text-xs font-semibold tracking-wide text-primary uppercase">Next up</p>
					{/if}
				</div>
			{/each}
		</div>
		<p class="mt-3 text-sm text-muted">
			Plus by-elections, party primaries, boundary reviews and referenda in every year between.
		</p>

		<!-- Why it compounds -->
		<div class="mt-9 grid gap-6 lg:grid-cols-3">
			<div class="rounded-2xl border border-border bg-surface p-6">
				<h3 class="text-lg font-semibold text-heading">The record deepens every cycle</h3>
				<p class="mt-2.5 text-sm leading-relaxed text-muted">
					1,478 leaders and 1,882 positions today. After 2027 that becomes a before-and-after on
					every promise made. After 2032 it is two full cycles of who said what and what they
					delivered. Nobody can start that archive in 2031 and catch up.
				</p>
			</div>
			<div class="rounded-2xl border border-border bg-surface p-6">
				<h3 class="text-lg font-semibold text-heading">It does not go quiet between votes</h3>
				<p class="mt-2.5 text-sm leading-relaxed text-muted">
					The news engine ingests and classifies mentions daily whether or not there is an
					election. Governance is a five-year story, and the years between cycles are when
					delivery records are actually written.
				</p>
			</div>
			<div class="rounded-2xl border border-border bg-surface p-6">
				<h3 class="text-lg font-semibold text-heading">The domain never dates</h3>
				<p class="mt-2.5 text-sm leading-relaxed text-muted">
					vote.ke does not carry a year, a party, a name or a slogan. It will read exactly as well
					in 2042 as it does today, which is not true of a single campaign URL ever registered in
					this country.
				</p>
			</div>
		</div>

		<!-- Urgency, reframed -->
		<div class="mt-9 grid gap-6 border-t border-border pt-8 lg:grid-cols-3">
			<h3 class="text-xl font-bold text-heading sm:text-2xl">So why buy now</h3>
			<p class="text-base leading-relaxed text-muted">
				Because the asset is permanent and the price is not. Demand for it spikes into every
				election and everyone who wants it will want it at the same time. Buying between cycles is
				the cheapest this will ever be.
			</p>
			<p class="text-lg leading-snug font-semibold text-heading">
				Buying early buys the one thing an election cannot give you back: time to make it yours
				before it matters.
			</p>
		</div>
	</section>

	<!-- ── Headroom ────────────────────────────────────────────── -->
	<section class="mt-16 border-t border-border pt-10">
		<h2 class="text-2xl font-bold text-heading sm:text-3xl lg:text-4xl">
			What the next owner can unlock
		</h2>
		<p class="mt-3 max-w-4xl text-lg leading-relaxed text-muted">
			None of these is built. All of them are cheap from here and expensive from scratch, because
			the geography, the seat structure, the daily ingestion and the audience already exist. This is
			the headroom you are buying, not a roadmap we are promising.
		</p>
		<div class="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each superpowers as sp (sp.t)}
				<div class="flex flex-col rounded-2xl border border-border bg-surface p-6">
					<h3 class="text-base font-bold text-heading">{sp.t}</h3>
					<p class="mt-2 text-sm leading-relaxed text-muted">{sp.d}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── 1. What it cost ─────────────────────────────────────── -->
	<section class="mt-16 border-t border-border pt-10">
		<h2 class="text-2xl font-bold text-heading sm:text-3xl lg:text-4xl">What it cost to build</h2>
		<p class="mt-3 max-w-4xl text-lg leading-relaxed text-muted">
			429 commits between 4 July and 7 September 2026, across 1,402 files, running in production.
			Here is everything that shipped.
		</p>

		<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each built as b (b.m)}
				<div class="flex flex-col rounded-2xl border border-border bg-surface p-5">
					<h3 class="text-sm font-bold text-heading">{b.m}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-muted">{b.d}</p>
				</div>
			{/each}
		</div>

		<!-- One multiplication, checkable in your head -->
		<div class="mt-8 rounded-2xl border border-border bg-surface-2 p-8">
			<div class="grid gap-8 lg:grid-cols-3">
				<div class="lg:col-span-2">
					<h3 class="text-xl font-bold text-heading sm:text-2xl">The maths, in one line</h3>
					<p class="mt-3 text-base leading-relaxed text-muted">
						It took over <strong class="font-semibold text-heading">60 days</strong> of design,
						engineering and project management, each taking over
						<strong class="font-semibold text-heading">8 hours a day</strong>, charged at
						<strong class="font-semibold text-heading">KES 10,000 an hour</strong> to develop vote.ke. 
					</p>
					<div class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-semibold text-heading">
						<span>{DAYS} days</span>
						<span class="text-muted">x</span>
						<span>{HOURS_PER_DAY} hours</span>
						<span class="text-muted">x</span>
						<span>{DISCIPLINES} disciplines</span>
						<span class="text-muted">x</span>
						<span>KES {kes(RATE)}</span>
					</div>
					<p class="mt-4 text-sm leading-relaxed text-muted">
						<a
							href="https://linkedin.com/in/MwirabuaTim"
							target="_blank"
							rel="noopener noreferrer"
							class="font-semibold text-primary hover:underline">The architect</a
						> has been delivering software for over 14 years. He previously worked at Microsoft as a
						Senior Software Engineer, shipping to hundreds of millions of users across more than 50
						Microsoft products.
					</p>
					<p class="mt-3 text-sm leading-relaxed text-muted">
						The same engineering practices went into vote.ke, and they continue under the
						twelve-month maintenance contract included in the sale.
					</p>
				</div>

				<div class="flex flex-col justify-center rounded-2xl border-2 border-primary bg-surface p-6 text-center">
					<p class="text-xs font-semibold tracking-[0.18em] text-muted uppercase">Cost of the build</p>
					<p class="mt-2 text-3xl font-bold tracking-tight text-heading lg:text-4xl">
						KES {kes(buildTotal)}
					</p>
					<p class="mt-3 text-xs leading-relaxed text-muted">
						Excludes AI inference and deployment costs, which are paid separately and continue
						monthly.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- ── 2. What it can earn ─────────────────────────────────── -->
	<section class="mt-16 border-t border-border pt-10">
		<h2 class="text-2xl font-bold text-heading sm:text-3xl lg:text-4xl">
			What it can earn in one election cycle
		</h2>

		<div class="mt-5 grid gap-6 lg:grid-cols-3">
			<div class="space-y-4 text-base leading-relaxed text-muted lg:col-span-2">
				<p>
					Kenya cleared roughly 16,000 candidates in 2022. Before party nominations thin the field,
					the pool of aspirants runs closer to 25,000. Every one of them has a budget, a deadline
					and no software.
				</p>
				<p>
					Our rate card is live on <a href="/pricing" class="text-primary hover:underline">the pricing page</a>. Weighted the
					way the 2022 candidate spread implies:
				</p>

				<table class="w-full border-collapse text-left text-sm">
					<thead>
						<tr class="border-b border-border">
							<th class="pb-2 pr-4 text-xs font-semibold tracking-wide text-muted uppercase">Tier</th>
							<th class="pb-2 pr-4 text-right text-xs font-semibold tracking-wide text-muted uppercase">Per month</th>
							<th class="pb-2 pr-4 text-right text-xs font-semibold tracking-wide text-muted uppercase">Share</th>
							<th class="pb-2 text-right text-xs font-semibold tracking-wide text-muted uppercase">Contributes</th>
						</tr>
					</thead>
					<tbody>
						{#each tiers as t (t.name)}
							<tr class="border-b border-border/60">
								<td class="py-2 pr-4 font-semibold text-heading">{t.name}</td>
								<td class="py-2 pr-4 text-right tabular-nums text-heading">{kes(t.price)}</td>
								<td class="py-2 pr-4 text-right tabular-nums text-muted">{t.share * 100}%</td>
								<td class="py-2 text-right tabular-nums text-heading">{kes(t.price * t.share)}</td>
							</tr>
						{/each}
						<tr>
							<td class="pt-3 pr-4 font-bold text-heading">Blended</td>
							<td class="pt-3 pr-4"></td>
							<td class="pt-3 pr-4"></td>
							<td class="pt-3 text-right text-base font-bold tabular-nums text-primary">
								{kes(ARPU)}
							</td>
						</tr>
					</tbody>
				</table>
				<p class="mt-4 text-sm leading-relaxed">
					<a href="https://en.wikipedia.org/wiki/2022_Kenyan_general_election" class="text-primary hover:underline" target="_blank">16,000</a> candidates were cleared in 2022. Pre-nomination aspirant counts run 1.5-2x cleared numbers, so the 2027 addressable pool is ~25,000-30,000.
					The only thing that varies is how many aspirants pay, which is <span class="font-bold text-heading">a question of how hard you sell.</span>
				</p>
			</div>

			<aside class="flex flex-col justify-center items-center text-center rounded-2xl border-l-4 border-primary bg-surface-2 px-6 py-7">
				<p class="text-xs font-semibold tracking-[0.18em] text-muted uppercase">Minimum projected revenue</p>
				<p class="mt-3 text-3xl font-bold tracking-tight text-heading lg:text-4xl">
					KES {kes(cycle(500))} 
				</p>
				<span class="mt-2 text-xs text-muted">(For 2027 cycle)</span>
				<p class="mt-4 text-sm leading-relaxed text-muted">
					You need only 500 aspirants on the blended price of KES 6,875 a month, for twelve months.
					500 out of 25,000. That is one in fifty.
				</p>
			</aside>
		</div>

		<div class="mt-7 overflow-x-auto">
			<table class="w-full min-w-[40rem] border-collapse text-left text-sm">
				<thead>
					<tr class="border-b-2 border-border">
						<th class="pb-3 pr-4 text-xs font-semibold tracking-wide text-muted uppercase">Case</th>
						<th class="pb-3 pr-4 text-xs font-semibold tracking-wide text-muted uppercase">The pool</th>
						<th class="pb-3 pr-4 text-xs font-semibold tracking-wide text-muted uppercase">Convert</th>
						<th class="pb-3 pr-4 text-xs font-semibold tracking-wide text-muted uppercase">Subscriptions</th>
						<th class="pb-3 pr-4 text-xs font-semibold tracking-wide text-muted uppercase">Months</th>
						<th class="pb-3 pr-4 text-xs font-semibold tracking-wide text-muted uppercase">Blended</th>
						<th class="pb-3 text-right text-xs font-semibold tracking-wide text-muted uppercase">2027 Cycle revenue</th>
					</tr>
				</thead>
				<tbody>
					{#each cases as c (c.c)}
						<tr class="border-b border-border/60 {c.c === 'Bear' ? 'bg-surface-2' : ''}">
							<td class="py-3 pr-4 font-bold {c.c === 'Bear' ? 'text-primary' : 'text-heading'}">{c.c}</td>
							<td class="py-3 pr-4 tabular-nums text-muted">25,000</td>
							<td class="py-3 pr-4 tabular-nums text-heading">{c.pct}</td>
							<td class="py-3 pr-4 tabular-nums text-heading">{kes(c.subs)} </td>
							<td class="py-3 pr-4 tabular-nums text-muted">12</td>
							<td class="py-3 pr-4 tabular-nums text-muted">6,875 x {kes(c.subs)} x 12</td>
							<td class="py-3 text-right text-base font-bold tabular-nums whitespace-nowrap {c.c === 'Bear' ? 'text-primary' : 'text-heading'}">
								{kes(cycle(c.subs))}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<p class="mt-5 max-w-5xl text-sm leading-relaxed text-muted">
			This counts subscriptions only. In addition to that you will earn from broadcast credits, the 5 percent fundraising fee and setup services. 
		</p>
	</section>

	<!-- ── 3. The ask ──────────────────────────────────────────── -->
	<section class="mt-16 rounded-2xl border-2 border-primary bg-surface-2 p-8 sm:p-10">
		<div class="grid gap-8 lg:grid-cols-3">
			<div>
				<p class="text-sm font-semibold tracking-[0.18em] text-primary uppercase">The Price</p>
				<p class="mt-3 text-4xl font-bold tracking-tight text-heading lg:text-5xl">
					KES {kes(ASK)}
				</p>
				<p class="mt-1 text-sm text-muted">Approximately USD {kes(USD)}</p>
				<p class="mt-4 text-base leading-relaxed text-heading">
					Everything on this page, plus twelve months of maintenance and support.
				</p>
			</div>

			<div class="lg:col-span-2">
				<h3 class="text-xs font-semibold tracking-[0.18em] text-muted uppercase">How that number was reached</h3>
				<ol class="mt-4 space-y-3">
					<li class="flex gap-4 text-sm leading-relaxed text-muted">
						<span class="shrink-0 font-bold text-primary">1</span>
						<span>
							<strong class="font-semibold text-heading">Start with the bear case.</strong> 
							The minimum revenue projected for the 2027 cycle is KES {kes(cycle(500))}.
						</span>
					</li>
					<li class="flex gap-4 text-sm leading-relaxed text-muted">
						<span class="shrink-0 font-bold text-primary">2</span>
						<span>
							<strong class="font-semibold text-heading">Take 75 percent of it.</strong>
							Pay only 75 percent of the minimum you could get back. {kes(cycle(500))} x 0.75 = {kes(ASK)}. In the worst case, you could earn a <strong class="font-semibold text-heading">profit of KES {kes(HEADROOM)}</strong>
						</span>
					</li>
					<li class="flex gap-4 text-sm leading-relaxed text-muted">
						<span class="shrink-0 font-bold text-primary">4</span>
						<span>
							<strong class="font-semibold text-heading">Consider the future potential.</strong>
							You will continue to earn from vote.ke in <strong class="font-semibold text-heading">2032, 2037, 2042 and beyond.</strong>
							The record gets deeper and the brand grows with every election cycle.
						</span>
					</li>
				</ol>
			</div>
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
