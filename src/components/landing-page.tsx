"use client"
import Link from "next/link";
import { startGitHubSignIn } from "@/lib/auth-client";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleDot,
  Clock3,
  Github,
  Layers3,
  Rocket,
  Terminal,
  Zap,
} from "lucide-react";

export function LandingPage() {
  const dispatch = useAppDispatch();

  return (
    <main className="overflow-hidden bg-white text-[#242424]">
      <section className="relative isolate flex min-h-[760px] flex-col overflow-hidden bg-[#faf9f8] text-[#242424] lg:min-h-[min(900px,100svh)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d6d6d6_0.7px,transparent_0.7px)] bg-[size:22px_22px] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 -top-56 size-[680px] rounded-full border border-[#dbeafe]"
        />

        <header className="relative z-10 mx-auto flex h-[72px] w-full max-w-[1320px] items-center justify-between border-b border-[#edebe9] bg-white/75 px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-2.5" aria-label="CloudShip home">
            <span className="grid size-8 place-items-center rounded-[4px] bg-[#0078d4] text-white">
              <span className="text-base font-black">C</span>
            </span>
            <span className="text-[16px] font-semibold tracking-[-0.02em]">CloudShip</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            <a href="#workflow" className="text-[13px] font-medium text-[#424242] transition-colors hover:text-[#0078d4]">
              How it works
            </a>
            <a href="#workspace" className="text-[13px] font-medium text-[#424242] transition-colors hover:text-[#0078d4]">
              The workspace
            </a>
          </nav>

          <button
            onClick={() => startGitHubSignIn(dispatch)}
            className="inline-flex h-9 items-center gap-2 rounded-[4px] border border-[#8a8886] bg-white px-3.5 text-xs font-semibold text-[#242424] transition hover:border-[#605e5c] hover:bg-[#f3f2f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0078d4]"
          >
            <Github size={15} />
            Sign in
          </button>
        </header>

        <div className="relative z-10 mx-auto grid w-full max-w-[1320px] flex-1 items-center gap-14 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 lg:px-12 lg:pb-20 lg:pt-12">
          <div className="animate-enter max-w-[610px]">
            <h1 className="max-w-[650px] text-[clamp(3rem,6vw,5rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
              From commit
              <br />
              to <span className="text-[#0078d4]">cloud.</span>
              <br />
              <span className="text-[#605e5c]">Without the chaos.</span>
            </h1>

            <p className="mt-6 max-w-[510px] text-[15px] leading-7 text-[#605e5c] sm:text-base sm:leading-8">
              Bring your GitHub projects, deployment history, and release status
              into one calm workspace. Your code stays yours. Your next release
              stays in view.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={() => startGitHubSignIn(dispatch)}
                className="group inline-flex h-11 items-center gap-2.5 rounded-[4px] bg-[#0078d4] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#106ebe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0078d4] focus-visible:ring-offset-2"
              >
                <Github size={17} />
                Continue with GitHub
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#workflow"
                className="inline-flex h-11 items-center gap-2 rounded-[4px] px-4 text-sm font-semibold text-[#424242] transition-colors hover:bg-[#f3f2f1] hover:text-[#242424]"
              >
                Explore the workflow
                <ArrowDown size={14} />
              </a>
            </div>

            <div className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-[#605e5c]">
              <Check size={13} className="mt-0.5 shrink-0 text-[#107c10]" />
              <p>Connect your GitHub account to see your projects.</p>
            </div>
          </div>

          <div id="workspace" className="animate-enter relative mx-auto w-full max-w-[650px] [animation-delay:120ms]">
            <div aria-hidden="true" className="absolute -inset-4 rounded-2xl bg-[#dbeafe]/60 blur-2xl" />
            <div className="relative overflow-hidden rounded-lg border border-[#edebe9] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <div className="flex h-12 items-center justify-between border-b border-[#edebe9] bg-white px-4 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-6 place-items-center rounded-[3px] bg-[#0078d4] text-[10px] font-black text-white">C</span>
                  <span className="text-[11px] font-semibold text-slate-800">CloudShip</span>
                  <span className="hidden text-[#c8c6c4] sm:inline">/</span>
                  <span className="hidden text-[10px] font-semibold text-[#424242] sm:inline">Workspace</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#c8e6c9] bg-[#f1f8f1] px-2.5 py-1 text-[9px] font-semibold text-[#107c10]">
                  <span className="size-1.5 rounded-full bg-[#107c10]" />
                  Workspace ready
                </span>
              </div>

              <div className="grid min-h-[340px] grid-cols-[44px_1fr] sm:grid-cols-[52px_1fr]">
                <aside aria-hidden="true" className="flex flex-col items-center gap-4 border-r border-[#edebe9] bg-[#faf9f8] py-4">
                  <span className="grid size-7 place-items-center rounded-[4px] bg-[#deecf9] text-[#0078d4]"><Layers3 size={14} /></span>
                  <span className="grid size-7 place-items-center rounded-lg text-slate-400"><Rocket size={14} /></span>
                  <span className="grid size-7 place-items-center rounded-lg text-slate-400"><Terminal size={14} /></span>
                </aside>

                <div className="min-w-0 p-4 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#605e5c]">Your workspace</p>
                      <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-slate-950 sm:text-lg">Project overview</h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#edebe9] bg-white px-2 py-1 text-[9px] font-medium text-[#424242]">
                      <Github size={11} /> GitHub connected
                    </span>
                  </div>

                  <div className="mt-5 rounded-md border border-[#edebe9] bg-[#faf9f8] p-3.5 sm:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-[4px] bg-[#deecf9] text-[#0078d4]"><Layers3 size={15} /></span>
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold text-slate-900">your-project</p>
                          <p className="mt-0.5 truncate text-[9px] text-slate-500">main · latest activity</p>
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-[4px] bg-[#f1f8f1] px-2 py-1 text-[9px] font-semibold text-[#107c10]">
                        <CircleDot size={9} /> Live
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3">
                      <span className="grid size-5 place-items-center rounded-[3px] bg-[#edebe9] text-[#605e5c]"><Zap size={10} /></span>
                      <span className="truncate font-mono text-[9px] text-[#605e5c]">Deployment status at a glance</span>
                      <span className="ml-auto flex shrink-0 items-center gap-1 text-[9px] text-slate-500"><Clock3 size={10} /> Just now</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-md border border-[#edebe9] bg-white p-3.5">
                      <p className="text-[9px] font-medium text-slate-500">Projects</p>
                      <p className="mt-1.5 text-xl font-semibold tracking-tight text-slate-900">In one place</p>
                      <p className="mt-1 text-[9px] text-slate-500">Synced from GitHub</p>
                    </div>
                    <div className="rounded-md border border-[#edebe9] bg-white p-3.5">
                      <p className="text-[9px] font-medium text-slate-500">Release history</p>
                      <div className="mt-2.5 flex h-5 items-end gap-1">
                        {[30, 48, 38, 65, 46, 78, 56, 94, 68, 82, 58, 100, 72, 88].map((height, index) => (
                          <span
                            key={index}
                            className="min-w-0 flex-1 rounded-t-[2px] bg-[#0078d4]"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-[9px] text-slate-500">Every change, easy to trace</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-md border border-[#c7e0f4] bg-[#f0f6fc] px-3 py-2.5">
                    <span className="grid size-5 place-items-center rounded-[3px] bg-[#deecf9] text-[#0078d4]"><ArrowRight size={10} /></span>
                    <p className="text-[9px] leading-4 text-slate-700">A clear view from connected repo to next release.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#edebe9] px-4 py-2.5 text-[9px] text-[#605e5c] sm:px-5">
                <span>PRODUCT PREVIEW</span>
                <span>Projects <span className="px-1 text-slate-300">·</span> Deployments <span className="px-1 text-slate-300">·</span> Environments</span>
              </div>
            </div>
            <div aria-hidden="true" className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-md border border-[#edebe9] bg-white px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:flex">
              <span className="grid size-7 place-items-center rounded-[4px] bg-[#f1f8f1] text-[#107c10]"><Check size={14} /></span>
              <div><p className="text-[10px] font-semibold text-slate-900">Release clarity</p><p className="text-[9px] text-slate-500">From commit to status</p></div>
            </div>
          </div>
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-[1320px] items-center justify-between border-t border-[#edebe9] px-5 py-4 text-[9px] font-semibold tracking-[0.1em] text-[#605e5c] sm:px-8 lg:px-12">
          <span>BUILT FOR DEVELOPERS WHO SHIP</span>
          <a href="#workflow" className="inline-flex items-center gap-2 tracking-normal text-[#424242] transition hover:text-[#0078d4]">
            See how it works <ArrowDown size={12} />
          </a>
        </div>
      </section>

      <section id="workflow" className="relative bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0078d4]">A calmer release workflow</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
              The path to production, made clearer.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              See what is connected, what is shipping, and what comes next—all
              without losing sight of your code.
            </p>
          </div>

          <div className="mt-11 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Connect your code",
                description: "Authorize GitHub and bring your repositories into one focused workspace.",
                icon: Github,
                tone: "bg-[#deecf9] text-[#0078d4] ring-[#c7e0f4]",
              },
              {
                number: "02",
                title: "Get release-ready",
                description: "Keep project settings, environments, and deployment history close at hand.",
                icon: Layers3,
                tone: "bg-[#f3f2f1] text-[#605e5c] ring-[#edebe9]",
              },
              {
                number: "03",
                title: "Ship with confidence",
                description: "Track deployment records and status as you connect your own runner.",
                icon: Rocket,
                tone: "bg-[#f1f8f1] text-[#107c10] ring-[#c8e6c9]",
              },
            ].map(({ number, title, description, icon: Icon, tone }) => (
              <article key={number} className="group rounded-md border border-[#edebe9] bg-white p-6 shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-colors hover:border-[#c7e0f4] hover:bg-[#faf9f8]">
                <div className="flex items-center justify-between">
                  <span className={`grid size-10 place-items-center rounded-xl ring-1 ring-inset ${tone}`}><Icon size={17} /></span>
                  <span className="font-mono text-[10px] text-slate-400">{number}</span>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-[-0.02em] text-slate-900">{title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#edebe9] bg-[#faf9f8] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1180px] gap-10 py-10 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="CloudShip home">
              <span className="grid size-8 place-items-center rounded-[4px] bg-[#0078d4] text-sm font-black text-white">C</span>
              <span className="text-sm font-semibold text-[#242424]">CloudShip</span>
            </Link>
            <p className="mt-3 max-w-sm text-xs leading-5 text-[#605e5c]">
              A clear workspace for GitHub projects, releases, and deployments.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#workflow" className="text-xs font-medium text-[#424242] transition-colors hover:text-[#0078d4]">
              How it works
            </a>
            <a href="#workspace" className="text-xs font-medium text-[#424242] transition-colors hover:text-[#0078d4]">
              Workspace
            </a>
            <button
              onClick={() => startGitHubSignIn(dispatch)}
              className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-[#0078d4] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#106ebe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0078d4] focus-visible:ring-offset-2"
            >
              <Github size={14} />
              Sign in
            </button>
          </nav>
        </div>
        <div className="border-t border-[#edebe9]">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-2 py-4 text-[10px] text-[#605e5c]">
            <span>© 2026 CloudShip</span>
            <span>Built for teams shipping with GitHub.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
