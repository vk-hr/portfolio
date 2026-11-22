/**
 * Splits recent GitHub Actions jobs into waiting, setup, running and teardown
 * and prints p50/p95 for each, plus the wall time a commit waits for its
 * result.
 *
 *   bun scripts/ci-audit.ts [--limit 150] [--branch main] [--event pull_request]
 *
 * Every attempt of a run counts (reruns are separate samples). Needs `gh` to
 * be logged in. Step timestamps from the API have 1-second resolution.
 *
 *   waiting   run attempt started → job started (dispatch + queue)
 *   setup     job started → last setup step done (checkout, Bun, cache, install)
 *   running   the steps that check something
 *   teardown  post-steps and "Complete job"
 *   wall      run attempt started → last job done (what a PR author waits)
 */
import { parseArgs } from "node:util";

const { values } = parseArgs({
	options: {
		limit: { type: "string", default: "150" },
		branch: { type: "string" },
		event: { type: "string" },
		repo: { type: "string" },
		json: { type: "boolean", default: false },
	},
});

type Step = {
	name: string;
	started_at: string | null;
	completed_at: string | null;
	conclusion: string | null;
};
type Job = {
	name: string;
	started_at: string;
	completed_at: string | null;
	conclusion: string | null;
	steps?: Array<Step>;
};
type Run = {
	id: number;
	run_attempt: number;
	status: string;
	event: string;
	head_branch: string;
};

const SETUP =
	/^(Set up job|Run actions\/checkout|Run actions\/cache|Run oven-sh\/setup-bun|Set up Bun|Restore|Install|Run bun install|Run \.\/\.github\/actions\/setup)/;
const TEARDOWN = /^(Post |Complete job)/;

const repo =
	values.repo ??
	(
		await Bun.$`gh repo view --json nameWithOwner --jq .nameWithOwner`.text()
	).trim();

async function api<T>(path: string): Promise<T> {
	return JSON.parse(await Bun.$`gh api ${path}`.text()) as T;
}

const t = (s: string) => Date.parse(s) / 1000;

const limit = Number(values.limit);
const runs: Array<Run> = [];
for (let page = 1; runs.length < limit; page++) {
	const query = new URLSearchParams({ per_page: "100", page: String(page) });
	if (values.branch) query.set("branch", values.branch);
	if (values.event) query.set("event", values.event);
	const { workflow_runs } = await api<{ workflow_runs: Array<Run> }>(
		`repos/${repo}/actions/runs?${query}`,
	);
	if (workflow_runs.length === 0) break;
	runs.push(...workflow_runs.filter((r) => r.status === "completed"));
}
runs.length = Math.min(runs.length, limit);

type Sample = Record<"waiting" | "setup" | "running" | "teardown", number> & {
	job: string;
};
const samples: Array<Sample> = [];
const walls: Array<number> = [];

for (const run of runs) {
	for (let attempt = 1; attempt <= run.run_attempt; attempt++) {
		const info = await api<{ run_started_at: string; status: string }>(
			`repos/${repo}/actions/runs/${run.id}/attempts/${attempt}`,
		);
		const { jobs } = await api<{ jobs: Array<Job> }>(
			`repos/${repo}/actions/runs/${run.id}/attempts/${attempt}/jobs?per_page=100`,
		);
		const start = t(info.run_started_at);
		// Cancelled and skipped jobs say nothing about how long a check takes.
		const done = jobs.filter(
			(j) =>
				j.completed_at &&
				(j.conclusion === "success" || j.conclusion === "failure"),
		);
		if (done.length === 0) continue;
		walls.push(
			Math.max(...done.map((j) => t(j.completed_at as string))) - start,
		);
		for (const job of done) {
			const steps = (job.steps ?? []).filter(
				(s) => s.started_at && s.completed_at,
			);
			const jobStart = t(job.started_at);
			const lastSetup = steps.filter((s) => SETUP.test(s.name)).at(-1);
			const firstTeardown = steps.find((s) => TEARDOWN.test(s.name));
			const setupEnd = lastSetup
				? t(lastSetup.completed_at as string)
				: jobStart;
			const runEnd = firstTeardown
				? t(firstTeardown.started_at as string)
				: t(job.completed_at as string);
			samples.push({
				job: job.name,
				waiting: jobStart - start,
				setup: setupEnd - jobStart,
				running: Math.max(0, runEnd - setupEnd),
				teardown: t(job.completed_at as string) - runEnd,
			});
		}
	}
}

function pct(xs: Array<number>, p: number) {
	if (xs.length === 0) return Number.NaN;
	const sorted = [...xs].sort((a, b) => a - b);
	return sorted[
		Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)
	] as number;
}

const buckets = ["waiting", "setup", "running", "teardown"] as const;
type Bucket = (typeof buckets)[number];
type Spread = { p50: number; p95: number };

const byJob = new Map<string, Array<Sample>>();
for (const sample of samples) {
	byJob.set(sample.job, [...(byJob.get(sample.job) ?? []), sample]);
}
const rows = [...byJob].map(([job, xs]) => {
	const spread = {} as Record<Bucket, Spread>;
	for (const b of buckets) {
		const durations = xs.map((x) => x[b]);
		spread[b] = { p50: pct(durations, 50), p95: pct(durations, 95) };
	}
	return { job, n: xs.length, ...spread };
});
const wall = { n: walls.length, p50: pct(walls, 50), p95: pct(walls, 95) };

if (values.json) {
	console.log(
		JSON.stringify({ repo, runs: runs.length, wall, jobs: rows }, null, 2),
	);
} else {
	console.log(
		`${repo}: ${runs.length} runs, ${walls.length} attempts. Seconds, p50 / p95.\n`,
	);
	console.log(
		[
			"job".padEnd(16),
			"n".padStart(4),
			...buckets.map((b) => b.padStart(12)),
		].join(""),
	);
	for (const row of rows) {
		const cells = buckets.map((b) => {
			return `${row[b].p50} / ${row[b].p95}`.padStart(12);
		});
		console.log(
			[row.job.padEnd(16), String(row.n).padStart(4), ...cells].join(""),
		);
	}
	console.log(`\nwall (run start → last job done): ${wall.p50} / ${wall.p95}`);
}
