<script lang="ts">
	// Acquisition page. The asset is four things (domain, data, engine, audience)
	// and three very different buyers want different combinations of them, so the
	// page is structured by buyer rather than by feature.
	import Countdown from '$lib/components/Countdown.svelte';

	const stats = [
		{ n: '1,478', l: 'leader profiles' },
		{ n: '1,882', l: 'positions held, with track records' },
		{ n: '5,185', l: 'news articles collected and classified' },
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
			d: 'A working SvelteKit platform: daily news ingestion with AI sentiment classification, ward-level geography, ballot simulation, M-Pesa payments, SMS broadcast and a verification pipeline.'
		},
		{
			t: 'The audience',
			d: 'Roughly 128 Kenyans a day still arrive at vote.ke, and they kept arriving after the site went quiet. That is intent nobody had to buy.'
		}
	];
</script>

<svelte:head>
	<title>vote.ke is for sale</title>
	<meta
		name="description"
		content="Kenya's civic data platform: 1,478 leader profiles, 3,216 indexed pages, a live news engine and the vote.ke domain. Available before the 2027 cycle."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
	<!-- ── Hero ────────────────────────────────────────────────── -->
	<header class="border-b border-border pb-10">
		<p class="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Acquisition</p>
		<h1 class="mt-3 text-4xl font-bold tracking-tight text-heading sm:text-5xl">
			vote.ke is for sale
		</h1>
		<p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
			Kenya's civic data platform, the domain that names it, and the audience that already found
			it. Built through 2026, populated, indexed, and available now rather than in the panic of
			election year.
		</p>
		<div class="mt-6 flex flex-wrap items-center gap-4">
			<a
				href="/contact-us"
				class="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
			>
				Start a conversation
			</a>
			<span class="text-sm text-muted">Serious enquiries only. Full data room on request.</span>
		</div>
	</header>

	<!-- ── Numbers ─────────────────────────────────────────────── -->
	<section class="mt-12">
		<h2 class="text-xs font-semibold tracking-[0.18em] text-muted uppercase">What exists today</h2>
		<dl class="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
			{#each stats as s (s.l)}
				<div class="bg-surface p-5">
					<dt class="text-3xl font-bold tracking-tight text-heading">{s.n}</dt>
					<dd class="mt-1 text-sm leading-snug text-muted">{s.l}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<!-- ── What you get ────────────────────────────────────────── -->
	<section class="mt-14">
		<h2 class="text-2xl font-bold text-heading">Four assets, sold together</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each included as i (i.t)}
				<div class="rounded-xl border border-border bg-surface-2 p-6">
					<h3 class="text-base font-semibold text-heading">{i.t}</h3>
					<p class="mt-2 text-sm leading-relaxed text-muted">{i.d}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- ── Buyer 1: civic tech ─────────────────────────────────── -->
	<section class="mt-16 border-t border-border pt-10">
		<p class="text-xs font-semibold tracking-[0.18em] text-primary uppercase">For civic technology and accountability organisations</p>
		<h2 class="mt-3 max-w-3xl text-2xl font-bold text-heading">
			Skip the eighteen months you would otherwise spend building the boring half
		</h2>

		<div class="mt-5 max-w-3xl space-y-4 text-sm leading-relaxed text-muted">
			<p>
				Every accountability platform in this region dies the same way. A grant funds the build,
				the build consumes the grant, and the data goes stale between cycles because nobody funds
				maintenance. The mission was never the problem. The plumbing was.
			</p>
			<p class="text-heading">
				<strong class="font-semibold">The plumbing already exists here, and it is populated.</strong>
			</p>
			<ul class="ml-1 space-y-2">
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">A living record, not an archive.</strong> 1,478
					leaders with positions, experience and delivery tracking. The news engine ingests and
					classifies mentions daily, so the record updates itself between elections instead of
					decaying.
				</li>
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">Search already sends you people.</strong> 3,216
					pages indexed, and citizens still arrive daily on their own. Accountability work that
					nobody reads is a report. This is a destination.
				</li>
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">Built to the Data Protection Act.</strong> Party
					neutrality, verification and IEBC compliance were design constraints from day one, not
					retrofits. That is the part funders audit and the part that is expensive to add later.
				</li>
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">It arrives as evidence, not a proposal.</strong>
					A 2027-cycle grant application backed by a live platform with real traffic is a different
					document from one backed by a wireframe.
				</li>
			</ul>
			<p>
				If your mandate is civic transparency, the honest calculation is this: what would it cost
				you to build and populate this, and how much of that budget would be left for the actual
				work?
			</p>
		</div>
	</section>

	<!-- ── Buyer 2: pollsters ──────────────────────────────────── -->
	<section class="mt-16 border-t border-border pt-10">
		<p class="text-xs font-semibold tracking-[0.18em] text-primary uppercase">For pollsters and research firms</p>
		<h2 class="mt-3 max-w-3xl text-2xl font-bold text-heading">
			A standing panel of politically engaged Kenyans, and a sentiment instrument nobody else has
		</h2>

		<div class="mt-5 max-w-3xl space-y-4 text-sm leading-relaxed text-muted">
			<p>
				Your two hardest costs are recruitment and reach. Online panels in Kenya are thin, phone
				samples skew, and field work is expensive per respondent. Meanwhile the people you most
				want to sample are the ones who voluntarily research candidates online, and they are
				already here.
			</p>
			<ul class="ml-1 space-y-2">
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">Ward-level geography, already structured.</strong>
					All 47 counties down to ward, mapped to every elective seat. Your sampling frame and your
					cross-tabs are the same object.
				</li>
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">Ballot simulation is revealed preference.</strong>
					Visitors cast a practice ballot across all six elective levels. That is not a stated
					intention captured by an enumerator, it is a choice made privately, with geography
					attached. Run it continuously and you have a tracking instrument that costs nothing per
					response.
				</li>
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">A recruitment funnel that runs itself.</strong>
					Organic search brings politically engaged Kenyans daily. Converting a fraction of them
					into a consented panel is cheaper than any field recruitment you currently run.
				</li>
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">Publishable by design.</strong> Party-neutral,
					compliant, and defensible in a press release. A poll is only as credible as its
					instrument.
				</li>
			</ul>
			<p>
				The 2027 polling season is commissioned in 2026. Owning the instrument before the season
				starts is worth more than renting reach during it.
			</p>
		</div>
	</section>

	<!-- ── Buyer 3: aspirant ───────────────────────────────────── -->
	<section class="mt-16 border-t border-border pt-10">
		<p class="text-xs font-semibold tracking-[0.18em] text-primary uppercase">For an aspirant or a campaign</p>
		<h2 class="mt-3 max-w-3xl text-2xl font-bold text-heading">
			Own the place where voters go to check on you
		</h2>

		<div class="mt-5 max-w-3xl space-y-4 text-sm leading-relaxed text-muted">
			<p>
				Campaign websites are built in a hurry, live for eight months, and are forgotten the week
				after the vote. They cost real money and reach the people who already support you. This is
				a different kind of asset.
			</p>
			<ul class="ml-1 space-y-2">
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">A domain that ends the argument.</strong>
					vote.ke on a billboard, a t-shirt, a reflector or a radio spot needs no explanation and
					no spelling out. Ask anyone what it costs to make a made-up campaign URL memorable.
				</li>
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">The campaign toolkit is already built.</strong>
					Ward-targeted SMS broadcast, follower lists, vote pledges, M-Pesa fundraising with a
					double-entry ledger, a press desk, and an AI assistant that answers constituents from
					your own material. Twelve months of engineering, delivered.
				</li>
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">An audience that is not yours yet.</strong>
					Every campaign channel you own preaches to people who already follow you. This one brings
					undecided voters who came to research, which is the only audience worth reaching.
				</li>
				<li class="border-l-2 border-primary pl-4">
					<strong class="font-semibold text-heading">The credible play is to keep it neutral.</strong>
					Turn vote.ke into a partisan site and the traffic and trust evaporate within a cycle. Fund
					it, keep it independent, and be the leader who paid for Kenya's civic infrastructure. That
					is a better story than a campaign page, and it survives the election either way.
				</li>
			</ul>
		</div>
	</section>

	<!-- ── Timing ──────────────────────────────────────────────── -->
	<section class="mt-16 rounded-xl border border-border bg-surface-2 p-8">
		<h2 class="text-2xl font-bold text-heading">Why now, and not in 2027</h2>
		<div class="mt-4 grid gap-6 sm:grid-cols-2">
			<div class="space-y-3 text-sm leading-relaxed text-muted">
				<p>
					This asset has a clock on it. Its value rises through the 2027 cycle and falls sharply the
					week after the vote. Everyone who wants it will want it at the same time, and by then the
					price reflects that.
				</p>
				<p class="text-heading">
					Buying early buys the one thing an election cannot give you back: <strong class="font-semibold"
						>time to make it yours before it matters.</strong
					>
				</p>
			</div>
			<div class="text-center">
				<p class="text-xs font-semibold tracking-wide text-muted uppercase">Countdown to the vote</p>
				<div class="mt-3">
					<Countdown />
				</div>
			</div>
		</div>
	</section>

	<!-- ── CTA ─────────────────────────────────────────────────── -->
	<section class="mt-14 text-center">
		<h2 class="text-2xl font-bold text-heading">Let us talk</h2>
		<p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
			Tell us which of the four assets matter to you and we will put together the relevant numbers:
			traffic history, the data schema, the codebase, and what a transfer would involve.
		</p>
		<a
			href="/contact-us"
			class="mt-6 inline-block rounded-full bg-primary px-8 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
		>
			Start a conversation
		</a>
	</section>
</div>
