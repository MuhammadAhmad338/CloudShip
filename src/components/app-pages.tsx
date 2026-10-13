"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  FileText,
  Filter,
  GitBranch,
  Github,
  Globe2,
  Layers,
  LoaderCircle,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Deployment, Project } from "@/lib/data";
import { useWorkspaceData } from "@/lib/workspace-data";
import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  Field,
  PageHeading,
  Panel,
  SectionTitle,
  StatusBadge,
  fieldClass,
} from "@/components/ui";

type GitHubRepository = {
  id: number;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  url: string;
};

function ProjectMark({
  project,
  small = false,
}: {
  project: Pick<Project, "initials" | "color">;
  small?: boolean;
}) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-700",
    violet: "bg-violet-100 text-violet-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-md font-bold",
        small ? "size-8 text-[10px]" : "size-10 text-xs",
        colors[project.color] ?? colors.sky,
      )}
    >
      {project.initials}
    </span>
  );
}

function Metric({
  label,
  value,
  change,
  icon: Icon,
  tone,
  points,
}: {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone: string;
  points: number[];
}) {
  return (
    <Panel className="animate-enter p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[27px] font-bold leading-none tracking-[-0.04em] text-slate-950">
            {value}
          </p>
        </div>
        <span className={cn("grid size-9 place-items-center rounded-lg", tone)}>
          <Icon size={17} />
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
          <ArrowUpRight size={13} />
          {change}
          <span className="font-normal text-slate-400">vs last week</span>
        </span>
        <div aria-hidden="true" className="flex h-7 items-end gap-[3px]">
          {points.map((height, index) => (
            <span
              key={index}
              style={{ height: `${height}%` }}
              className="w-[4px] rounded-t-[2px] bg-sky-300 last:bg-sky-600"
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}

function DeploymentTable({
  rows,
  projects,
  compact = false,
}: {
  rows: Deployment[];
  projects: Project[];
  compact?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[690px] text-left">
        <thead>
          <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            <th className="px-5 py-3">Project</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Branch / commit</th>
            <th className="px-4 py-3">Environment</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-5 py-3 text-right">Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((deployment) => {
            const project = projects.find(
              (item) => item.id === deployment.projectId,
            );
            const projectMark = project ?? {
              initials: deployment.project.slice(0, 2).toUpperCase(),
              color: "sky",
            };
            return (
              <tr
                key={deployment.id}
                className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/80"
              >
                <td className="px-5 py-3.5">
                  <Link
                    href={`/deployments/${deployment.id}`}
                    className="flex items-center gap-3"
                  >
                    <ProjectMark project={projectMark} small />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-slate-800 group-hover:text-sky-700">
                        {deployment.project}
                      </span>
                      {!compact && (
                        <span className="mt-0.5 block max-w-[220px] truncate text-[10px] text-slate-400">
                          {deployment.message}
                        </span>
                      )}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={deployment.status} />
                </td>
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-1.5 text-xs text-slate-600">
                    <GitBranch size={12} className="text-slate-400" />
                    {deployment.branch}
                  </span>
                  <span className="mono mt-1 block text-[10px] text-slate-400">
                    {deployment.commit}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-slate-600">
                    {deployment.environment}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {deployment.created}
                </td>
                <td className="px-5 py-3.5 text-right text-xs tabular-nums text-slate-500">
                  {deployment.duration}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DashboardPage() {
  const { projects, deployments, loading, error } = useWorkspaceData();
  const bars = [
    34, 46, 40, 62, 48, 72, 56, 66, 83, 61, 76, 58, 91, 69, 82, 63, 74, 95, 72,
    87, 67, 79, 59, 74, 88, 68, 83, 61,
  ];
  const activeCount = deployments.filter((deployment) =>
    ["Queued", "Building", "Testing", "Deploying"].includes(deployment.status),
  ).length;
  const liveCount = deployments.filter(
    (deployment) => deployment.status === "Live",
  ).length;
  const repositoryCount = new Set(projects.map((project) => project.repository))
    .size;
  return (
    <>
      <PageHeading
        title="Good morning, Maya"
        description="Here's what's happening across your workspace."
        action={
          <Link href="/projects/new">
            <Button>
              <Plus size={16} />
              New project
            </Button>
          </Link>
        }
      />
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-center justify-between gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800"
        >
          <span>{error}</span>
          <Link href="/settings" className="shrink-0 font-semibold underline">
            Connection settings
          </Link>
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total projects"
          value={loading ? "—" : String(projects.length)}
          change="In this workspace"
          icon={Layers}
          tone="bg-sky-50 text-sky-700"
          points={[34, 50, 40, 66, 54, 82, 70]}
        />
        <Metric
          label="Active deployments"
          value={loading ? "—" : String(activeCount)}
          change="Currently running"
          icon={Radio}
          tone="bg-violet-50 text-violet-700"
          points={[72, 58, 69, 42, 57, 74, 64]}
        />
        <Metric
          label="Successful deployments"
          value={loading ? "—" : String(liveCount)}
          change="Live deployment records"
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-700"
          points={[38, 52, 46, 64, 59, 78, 91]}
        />
        <Metric
          label="GitHub repositories"
          value={loading ? "—" : String(repositoryCount)}
          change="Linked to projects"
          icon={Github}
          tone="bg-amber-50 text-amber-700"
          points={[48, 42, 57, 54, 69, 62, 80]}
        />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,.85fr)]">
        <Panel className="animate-enter delay-[50ms] overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4 px-5 pb-1 pt-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Deployment activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Successful deployments across all environments
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
              Last 7 days
              <ChevronDown size={13} />
            </button>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-end gap-5 px-5 pb-5 pt-4">
            <div>
              <p className="text-[30px] font-bold tracking-[-0.04em] text-slate-950">
                84{" "}
                <span className="text-sm font-medium tracking-normal text-slate-400">
                  deployments
                </span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700">
                <ArrowUpRight size={13} />
                12.8%{" "}
                <span className="text-slate-400">
                  compared to previous week
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="size-2 rounded-sm bg-sky-500" />
              Successful
              <span className="ml-2 size-2 rounded-sm bg-rose-300" />
              Failed
            </div>
          </div>
          <div className="soft-grid border-t border-slate-100 px-5 pb-4 pt-4">
            <div className="flex h-[126px] items-end gap-[3px]">
              {bars.map((height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 items-end gap-[2px]"
                >
                  <span
                    style={{ height: `${height}%` }}
                    className="w-full rounded-t-[2px] bg-sky-500/75 hover:bg-sky-600"
                  />
                  <span
                    style={{ height: `${Math.max(3, (index * 13) % 23)}%` }}
                    className="w-[3px] rounded-t-[2px] bg-rose-300/80"
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-slate-400">
              <span>Sep 22</span>
              <span>Sep 24</span>
              <span>Sep 26</span>
              <span>Sep 28</span>
            </div>
          </div>
        </Panel>
        <Panel className="animate-enter delay-[100ms] p-5">
          <SectionTitle
            title="Connected code"
            detail="Repositories attached to projects"
          />
          <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
            <span className="grid size-9 place-items-center rounded-lg bg-white text-slate-800 shadow-sm">
              <Github size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-800">
                {repositoryCount} repositories
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Across {projects.length} projects
              </p>
            </div>
            <span className="ml-auto size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-800">
                Deployment execution
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Queued records are saved to PostgreSQL
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
              Worker needed
            </span>
          </div>
          <Link
            href="/projects/new"
            className="mt-5 flex items-center justify-center gap-1 border-t border-slate-100 pt-4 text-xs font-semibold text-sky-700 hover:text-sky-800"
          >
            Add a project
            <ArrowRight size={13} />
          </Link>
        </Panel>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,.85fr)]">
        <Panel className="animate-enter delay-[100ms] overflow-hidden">
          <div className="flex items-center justify-between px-5 pb-1 pt-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent deployments
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest activity across your projects
              </p>
            </div>
            <Link
              href="/deployments"
              className="flex items-center gap-1 text-xs font-semibold text-sky-700"
            >
              All deployments
              <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mt-3">
            <DeploymentTable
              rows={deployments.slice(0, 4)}
              projects={projects}
              compact
            />
          </div>
        </Panel>
        <Panel className="animate-enter delay-[150ms] p-5">
          <SectionTitle
            title="Your projects"
            detail="Recently updated"
            action={
              <Link
                href="/projects"
                className="text-xs font-semibold text-sky-700"
              >
                View all
              </Link>
            }
          />
          <div className="space-y-1">
            {projects.slice(0, 4).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-slate-50"
              >
                <ProjectMark project={project} small />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-800">
                    {project.name}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-slate-400">
                    {project.updated}
                  </span>
                </span>
                <StatusBadge status={project.status} />
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function ProjectsPage() {
  const { projects, loading, error } = useWorkspaceData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All projects");
  const visible = projects.filter(
    (project) =>
      (project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.repository.toLowerCase().includes(query.toLowerCase())) &&
      (status === "All projects" || project.status === status),
  );
  return (
    <>
      <PageHeading
        title="Projects"
        description="Manage your connected repositories and applications."
        action={
          <Link href="/projects/new">
            <Button>
              <Plus size={16} />
              Add project
            </Button>
          </Link>
        }
      />
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800"
        >
          {error}
        </p>
      )}
      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-[210px] flex-1 sm:max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects..."
              className={`${fieldClass} pl-9`}
            />
          </div>
          <label className="relative">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={`${fieldClass} w-auto min-w-[142px] appearance-none pl-9 pr-8`}
            >
              <option>All projects</option>
              <option>Live</option>
              <option>Building</option>
              <option>Failed</option>
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </label>
          <span className="ml-auto text-xs text-slate-400">
            {visible.length} projects
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[660px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                <th className="px-5 py-3">Project</th>
                <th className="px-4 py-3">Framework</th>
                <th className="px-4 py-3">Environment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-3"
                    >
                      <ProjectMark project={project} />
                      <span>
                        <span className="block text-xs font-semibold text-slate-800">
                          {project.name}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-slate-400">
                          {project.repository}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">
                    {project.framework}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge>{project.environment}</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {project.updated}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/projects/${project.id}`}
                      aria-label={`Open ${project.name}`}
                      className="grid size-8 place-items-center rounded-md text-slate-400 hover:bg-slate-100"
                    >
                      <ArrowRight size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <p className="px-5 py-14 text-center text-sm text-slate-500">
              Loading projects…
            </p>
          ) : (
            visible.length === 0 && (
              <p className="px-5 py-14 text-center text-sm text-slate-500">
                No projects found. Try another search.
              </p>
            )
          )}
        </div>
      </Panel>
    </>
  );
}

function CreateProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { createProject } = useWorkspaceData();
  const [submitting, setSubmitting] = useState(false);
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [repositoriesLoading, setRepositoriesLoading] = useState(true);
  const [repositoryError, setRepositoryError] = useState<string | null>(null);
  const [framework, setFramework] = useState("Next.js");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setRepositoriesLoading(true);
    fetch("/api/github/repositories", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Could not load GitHub repositories.");
        return payload as GitHubRepository[];
      })
      .then((items) => {
        setRepositories(items);
        if (items[0]) {
          setRepo(items[0].fullName);
          setBranch(items[0].defaultBranch);
        }
        setRepositoryError(null);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setRepositoryError(cause instanceof Error ? cause.message : "Could not load GitHub repositories.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setRepositoriesLoading(false);
      });
    return () => controller.abort();
  }, [session?.user?.id]);

  async function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const form = new FormData(event.currentTarget);
    try {
      const project = await createProject({
        name: String(form.get("name") ?? ""),
        repository: repo,
        framework,
        environment: String(form.get("environment") ?? "Production"),
        branch: String(form.get("branch") ?? "main"),
        buildCommand: String(form.get("buildCommand") ?? "npm run build"),
        startCommand: String(form.get("startCommand") ?? "npm start"),
        rootDirectory: String(form.get("rootDirectory") ?? "/"),
      });
      router.push(`/projects/${project.id}`);
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : "Could not create project.",
      );
      setSubmitting(false);
    }
  }
  return (
    <>
      <div className="mb-5">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={14} />
          Back to projects
        </Link>
      </div>
      <PageHeading
        title="Create a project"
        description="Connect a repository and let Cloudlane handle the deployment setup."
      />
      <form
        onSubmit={submitProject}
        className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="space-y-5">
          <Panel className="p-5 md:p-6">
            <SectionTitle title="Project details" detail="Import a repository from your connected GitHub account." />
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3">
              <span className="grid size-9 place-items-center rounded-md bg-white text-slate-800 shadow-sm"><Github size={17} /></span>
              <div className="min-w-0 flex-1"><p className="text-xs font-semibold text-slate-800">GitHub connected</p><p className="mt-0.5 truncate text-[10px] text-slate-500">{session?.user?.name ?? session?.user?.email ?? "Connected account"}</p></div>
              <span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project name">
                <input
                  name="name"
                  required
                  defaultValue="My project"
                  className={fieldClass}
                />
              </Field>
              <Field label="Framework">
                <select
                  value={framework}
                  onChange={(event) => setFramework(event.target.value)}
                  className={fieldClass}
                >
                  <option>Next.js</option>
                  <option>Node.js</option>
                  <option>React</option>
                  <option>Flutter Web</option>
                </select>
              </Field>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_190px]">
              <Field
                label="GitHub repository"
                hint={repositoriesLoading ? "Loading repositories from GitHub…" : `${repositories.length} repositories available`}
              >
                <select
                  required
                  disabled={repositoriesLoading || repositories.length === 0}
                  value={repo}
                  onChange={(event) => {
                    const selected = repositories.find((item) => item.fullName === event.target.value);
                    setRepo(event.target.value);
                    if (selected) setBranch(selected.defaultBranch);
                  }}
                  className={fieldClass}
                >
                  {!repositories.length && <option value="">No repositories available</option>}
                  {repositories.map((repository) => <option key={repository.id} value={repository.fullName}>{repository.fullName}{repository.private ? " · Private" : ""}</option>)}
                </select>
              </Field>
              <Field label="Branch">
                <div className="relative">
                  <GitBranch
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="branch"
                    required
                    value={branch}
                    onChange={(event) => setBranch(event.target.value)}
                    className={`${fieldClass} pl-9`}
                  />
                </div>
              </Field>
            </div>
          </Panel>
          <Panel className="p-5 md:p-6">
            <SectionTitle
              title="Build settings"
              detail="Cloudlane detects sensible defaults from your framework."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Environment">
                <select name="environment" className={fieldClass}>
                  <option>Production</option>
                  <option>Staging</option>
                  <option>Development</option>
                </select>
              </Field>
              <Field label="Deploy branch">
                <input value={branch} className={fieldClass} readOnly />
              </Field>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Build command">
                <input
                  name="buildCommand"
                  defaultValue={
                    framework === "Flutter Web"
                      ? "flutter build web"
                      : "npm run build"
                  }
                  className={fieldClass}
                />
              </Field>
              <Field label="Start command">
                <input
                  name="startCommand"
                  defaultValue={
                    framework === "Next.js" ? "npm start" : "npm run start"
                  }
                  className={fieldClass}
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field
                label="Root directory"
                hint="Leave blank to use the repository root."
              >
                <input
                  name="rootDirectory"
                  placeholder="/"
                  className={fieldClass}
                />
              </Field>
            </div>
          </Panel>
        </div>
        <div className="space-y-4 xl:sticky xl:top-[88px]">
          <Panel className="overflow-hidden">
            <div className="soft-grid border-b border-slate-100 px-5 py-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <span className="grid size-7 place-items-center rounded-md bg-white text-slate-800 shadow-sm">
                  <Github size={15} />
                </span>
                Deployment preview
              </div>
              <p className="mono mt-4 text-[11px] text-slate-600">
                {repo || "owner/repository"}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                <GitBranch size={12} />
                {branch || "branch"}<span className="text-slate-300">·</span>
                <span>{framework}</span>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Build mode</span>
                <span className="font-medium text-slate-700">Automatic</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Deploy branch</span>
                <span className="font-medium text-slate-700">main</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Environment</span>
                <Badge tone="success">Production</Badge>
              </div>
            </div>
          </Panel>
          {repositoryError && <p role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">{repositoryError}</p>}
          <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3.5 text-[11px] leading-relaxed text-slate-500">
            <Shield size={15} className="mt-0.5 shrink-0 text-sky-700" />
            Secrets can be added after project creation. GitHub OAuth and
            deployment workers are not configured yet.
          </div>
          {formError && (
            <p
              role="alert"
              className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800"
            >
              {formError}
            </p>
          )}
          <div className="flex gap-2">
            <Link href="/projects" className="flex-1">
              <Button type="button" variant="secondary" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={submitting || repositoriesLoading || !repo} className="flex-1">
              {submitting ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Create project
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}

function ProjectDetailPage({ projectId }: { projectId: string }) {
  const [tab, setTab] = useState("Overview");
  const { projects, deployments, loading, error, createDeployment } =
    useWorkspaceData();
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const project = projects.find((item) => item.id === projectId);
  if (loading && !project)
    return (
      <Panel className="p-8 text-center text-sm text-slate-500">
        Loading project…
      </Panel>
    );
  if (!project)
    return (
      <Panel className="p-8 text-center">
        <p className="text-sm font-semibold text-slate-800">
          Project unavailable
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {error ?? "This project does not exist in the connected workspace."}
        </p>
        <Link
          href="/projects"
          className="mt-3 inline-block text-xs font-semibold text-sky-700"
        >
          Back to projects
        </Link>
      </Panel>
    );
  const recent = deployments.filter((item) => item.projectId === project.id);
  const current = recent[0];
  async function redeploy() {
    const projectId = project?.id;
    if (!projectId) return;
    setDeploying(true);
    setDeployError(null);
    try {
      await createDeployment(projectId);
    } catch (cause) {
      setDeployError(
        cause instanceof Error ? cause.message : "Could not queue deployment.",
      );
    } finally {
      setDeploying(false);
    }
  }
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={14} />
          All projects
        </Link>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTab("Settings")}
          >
            <Settings2 size={14} />
            Project settings
          </Button>
          <Button
            size="sm"
            disabled={deploying}
            onClick={() => void redeploy()}
          >
            {deploying ? (
              <>
                <LoaderCircle size={14} className="animate-spin" />
                Queueing…
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                Deploy
              </>
            )}
          </Button>
        </div>
      </div>
      {deployError && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800"
        >
          {deployError}
        </p>
      )}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <ProjectMark project={project} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[25px] font-bold tracking-[-0.03em] text-slate-950">
              {project.name}
            </h1>
            <StatusBadge status={project.status} />
          </div>
          <a
            href={`https://github.com/${project.repository}`}
            className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-700"
          >
            <Github size={13} />
            {project.repository}
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
      <div className="mb-5 flex gap-5 overflow-x-auto border-b border-slate-200">
        {["Overview", "Deployments", "Environment variables", "Settings"].map(
          (item) => (
            <button
              key={item}
              onClick={() =>
                item === "Deployments"
                  ? window.location.assign("/deployments")
                  : setTab(item)
              }
              className={cn(
                "shrink-0 border-b-2 px-0.5 pb-3 text-xs font-medium",
                tab === item
                  ? "border-sky-600 text-sky-700"
                  : "border-transparent text-slate-500 hover:text-slate-800",
              )}
            >
              {item}
            </button>
          ),
        )}
      </div>
      {tab === "Overview" ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(270px,.85fr)]">
          <div className="space-y-5">
            <Panel className="overflow-hidden">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        current?.status === "Live"
                          ? "bg-emerald-500"
                          : "bg-slate-300",
                      )}
                    />
                    <h2 className="text-sm font-semibold text-slate-900">
                      {current ? "Latest deployment" : "No deployments yet"}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {current
                      ? current.status
                      : "Queue a deployment to see its status and logs here."}
                  </p>
                </div>
                {current && (
                  <Link
                    href={`/deployments/${current.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-sky-700"
                  >
                    View details
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
              {current ? (
                <div className="p-5">
                  <p className="text-sm font-semibold text-slate-800">
                    {current.message}
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <GitBranch size={12} />
                      {current.branch}
                    </span>
                    <span className="mono">{current.commit}</span>
                    <span>{current.author}</span>
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                    {[
                      ["Created", current.created],
                      ["Duration", current.duration],
                      ["Triggered by", current.author],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] text-slate-400">{label}</p>
                        <p className="mt-1 text-xs font-medium text-slate-700">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <Button
                    size="sm"
                    disabled={deploying}
                    onClick={() => void redeploy()}
                  >
                    <Zap size={14} />
                    Deploy project
                  </Button>
                </div>
              )}
            </Panel>
            <Panel className="overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Latest deployments
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Recent build and release history
                  </p>
                </div>
                <Link
                  href="/deployments"
                  className="text-xs font-semibold text-sky-700"
                >
                  View all
                </Link>
              </div>
              <DeploymentTable rows={recent} projects={projects} compact />
            </Panel>
            <Panel className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Latest build logs
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {current ? `Deployment ${current.id}` : "No deployment"}
                  </p>
                </div>
                {current && (
                  <Link
                    href={`/deployments/${current.id}`}
                    className="text-xs font-semibold text-sky-700"
                  >
                    Open logs
                  </Link>
                )}
              </div>
              <pre className="mono min-h-16 whitespace-pre-wrap bg-[#111a24] px-5 py-4 text-[10px] leading-relaxed text-slate-300">
                {current?.logs ||
                  "No build output yet. Logs will appear when a deployment worker is connected."}
              </pre>
            </Panel>
          </div>
          <div className="space-y-5">
            <Panel className="p-5">
              <SectionTitle title="Project configuration" />
              <div className="space-y-4">
                {[
                  ["Framework", project.framework],
                  ["Repository", project.repository],
                  ["Branch", project.branch ?? "main"],
                  ["Environment", project.environment],
                ].map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-3"
                  >
                    <span className="text-[11px] text-slate-500">{key}</span>
                    <span className="max-w-[65%] break-all text-right text-[11px] font-medium text-slate-700">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel className="p-5">
              <SectionTitle title="Environment variables" />
              <p className="text-xs leading-relaxed text-slate-500">
                Variable storage is not connected to the backend yet. Do not add
                production secrets here.
              </p>
            </Panel>
          </div>
        </div>
      ) : (
        <Panel className="p-8 text-center">
          <div className="mx-auto grid size-10 place-items-center rounded-lg bg-sky-50 text-sky-700">
            <Settings2 size={18} />
          </div>
          <h2 className="mt-3 text-sm font-semibold text-slate-800">{tab}</h2>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
            {tab === "Environment variables"
              ? "Environment variable storage is not implemented yet."
              : `Project settings for ${project.name} are not connected yet.`}
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => setTab("Overview")}
          >
            <ArrowLeft size={13} />
            Back to overview
          </Button>
        </Panel>
      )}
    </>
  );
}

function DeploymentsPage() {
  const { deployments, projects, loading, error, refresh } = useWorkspaceData();
  const [filter, setFilter] = useState("All deployments");
  const [query, setQuery] = useState("");
  const visible = deployments.filter(
    (item) =>
      (filter === "All deployments" || item.status === filter) &&
      `${item.project} ${item.message} ${item.branch}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        title="Deployments"
        description="Build, release, and monitor every deployment across your workspace."
        action={
          <Button variant="secondary" onClick={refresh}>
            <RefreshCw size={14} />
            Refresh
          </Button>
        }
      />
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800"
        >
          {error}
        </p>
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {["All deployments", "Live", "Building", "Failed"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[11px] font-medium",
                filter === item
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-50",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-60">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter deployments..."
            className={`${fieldClass} pl-9`}
          />
        </div>
      </div>
      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              All deployments
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {visible.length} recent deployments
            </p>
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600">
            <Filter size={13} />
            Filters
          </button>
        </div>
        {loading ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            Loading deployments…
          </p>
        ) : visible.length ? (
          <DeploymentTable rows={visible} projects={projects} />
        ) : (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            No deployments yet. Open a project to queue the first one.
          </p>
        )}
      </Panel>
    </>
  );
}

const stages = ["Queued", "Building", "Testing", "Deploying", "Live"];
function DeploymentDetailPage({ deploymentId }: { deploymentId: string }) {
  const { deployments, projects, loading, error } = useWorkspaceData();
  const deployment = deployments.find((item) => item.id === deploymentId);
  const project =
    deployment && projects.find((item) => item.id === deployment.projectId);
  if (loading && !deployment)
    return (
      <Panel className="p-8 text-center text-sm text-slate-500">
        Loading deployment…
      </Panel>
    );
  if (!deployment || !project)
    return (
      <Panel className="p-8 text-center">
        <p className="text-sm font-semibold text-slate-800">
          Deployment unavailable
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {error ??
            "This deployment does not exist in the connected workspace."}
        </p>
        <Link
          href="/deployments"
          className="mt-3 inline-block text-xs font-semibold text-sky-700"
        >
          Back to deployments
        </Link>
      </Panel>
    );
  const stageIndex = stages.indexOf(deployment.status);
  const currentStage = Math.max(0, stageIndex);
  return (
    <>
      <div className="mb-5">
        <Link
          href="/deployments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={14} />
          All deployments
        </Link>
      </div>
      <PageHeading
        title={deployment.id}
        description={`${deployment.project} · ${deployment.environment} · ${deployment.created}`}
        action={
          <Button variant="secondary" size="sm" disabled title="A deployment worker and public URL are not configured yet">
            <ExternalLink size={14} />
            Visit site
          </Button>
        }
      />
      <Panel className="mb-5 overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ProjectMark project={project} small />
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {deployment.message}
                </p>
                <p className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                  <GitBranch size={11} />
                  {deployment.branch}
                  <span className="text-slate-300">·</span>
                  <span className="mono">{deployment.commit}</span>
                  <span className="text-slate-300">·</span>
                  {deployment.author}
                </p>
              </div>
            </div>
            <StatusBadge status={deployment.status} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-4 px-5 py-4 sm:grid-cols-3">
          {[
            ["Environment", deployment.environment],
            ["Duration", deployment.duration],
            ["Framework", project.framework],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] text-slate-400">{label}</p>
              <p className="mt-1 text-xs font-medium text-slate-700">{value}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 px-5 py-6">
          <div className="grid grid-cols-5">
            {stages.map((stage, index) => {
              const complete = index < currentStage;
              const current = index === currentStage;
              return (
                <div
                  key={stage}
                  className="relative flex flex-col items-center text-center"
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-6 place-items-center rounded-full border-2 bg-white",
                      complete
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : current
                          ? "border-sky-500 text-sky-600 ring-4 ring-sky-50"
                          : "border-slate-200 text-slate-300",
                    )}
                  >
                    {complete ? (
                      <Check size={12} />
                    ) : current && deployment.status === "Building" ? (
                      <LoaderCircle size={13} className="animate-spin" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "mt-2 text-[10px] font-medium",
                      complete || current ? "text-slate-800" : "text-slate-400",
                    )}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,.8fr)]">
        <Panel className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Build logs
              </h2>
              <p className="mt-1 text-xs text-slate-500">Output from the deployment worker</p>
            </div>
            <button
              aria-label="Copy logs"
              className="grid size-8 place-items-center rounded-md text-slate-400 hover:bg-slate-100"
            >
              <Copy size={14} />
            </button>
          </div>
          <pre className="mono min-h-16 whitespace-pre-wrap bg-[#111a24] p-5 text-[10px] leading-relaxed text-slate-300">{deployment.logs || "No build output yet. A deployment worker will write logs here."}</pre>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Build completed
            </span>
            <span>11 lines</span>
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel className="p-5">
            <SectionTitle title="Deployment summary" />
            <div className="space-y-4">
              {[
                ["Project", deployment.project],
                ["Commit", deployment.commit],
                ["Branch", deployment.branch],
                ["Triggered by", deployment.author],
                ["Created", deployment.created],
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3">
                  <span className="text-[11px] text-slate-500">{key}</span>
                  <span className="mono max-w-[65%] truncate text-right text-[10px] text-slate-700">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="p-5">
            <SectionTitle title="Deployment URL" />
            <p className="text-xs leading-relaxed text-slate-500">A public URL will be available when a deployment worker and hosting target are configured.</p>
          </Panel>
          <Panel className="p-5">
            <SectionTitle title="Build configuration" />
            <div className="space-y-3 text-[11px]">
              <div>
                <p className="mb-1 text-slate-400">Build command</p>
                <code className="mono text-slate-700">{project.buildCommand ?? "npm run build"}</code>
              </div>
              <div>
                <p className="mb-1 text-slate-400">Start command</p>
                <code className="mono text-slate-700">{project.startCommand ?? "npm start"}</code>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

function EnvironmentsPage() {
  const { environments, projects, loading, error } = useWorkspaceData();
  const [selected, setSelected] = useState("Production");
  const environment =
    environments.find((item) => item.name === selected) ?? environments[0];
  if (loading && !environment)
    return (
      <Panel className="p-8 text-center text-sm text-slate-500">
        Loading environments…
      </Panel>
    );
  if (!environment)
    return (
      <Panel className="p-8 text-center">
        <p className="text-sm font-semibold text-slate-800">
          No environments configured
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {error ?? "Create a project to begin using deployment environments."}
        </p>
      </Panel>
    );
  const environmentProjects = projects.filter(
    (project) => project.environment === environment.name,
  );
  return (
    <>
      <PageHeading
        title="Environments"
        description="Separate configuration and access controls for each stage of delivery."
        action={
          <Button>
            <Plus size={15} />
            Add environment
          </Button>
        }
      />
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800"
        >
          {error}
        </p>
      )}
      <div className="mb-5 flex flex-wrap gap-2">
        {environments.map((item) => (
          <button
            key={item.name}
            onClick={() => setSelected(item.name)}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium",
              selected === item.name
                ? "border-sky-300 bg-sky-50 text-sky-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                item.color === "emerald"
                  ? "bg-emerald-500"
                  : item.color === "amber"
                    ? "bg-amber-500"
                    : "bg-sky-500",
              )}
            />
            {item.name}
            <span className="text-[10px] opacity-60">{item.projects}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,.75fr)]">
        <div className="space-y-5">
          <Panel className="overflow-hidden">
            <div className="soft-grid border-b border-slate-100 p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-sky-50 text-sky-700">
                  <Globe2 size={19} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-slate-900">
                      {environment.name}
                    </h2>
                    <StatusBadge status={environment.protection} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {environment.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3">
              {[
                ["Projects", String(environment.projects)],
                ["Last deployment", environment.updated],
                ["Access", environment.protection],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] text-slate-400">{label}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Projects in {environment.name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Applications deployed to this environment
                </p>
              </div>
              <Link
                href="/projects"
                className="text-xs font-semibold text-sky-700"
              >
                Manage projects
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {environmentProjects.map((project) => (
                <Link
                  href={`/projects/${project.id}`}
                  key={project.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50"
                >
                  <ProjectMark project={project} small />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-slate-800">
                      {project.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-slate-400">
                      {project.repository}
                    </span>
                  </span>
                  <StatusBadge status={project.status} />
                  <ArrowRight size={14} className="text-slate-300" />
                </Link>
              ))}
            </div>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel className="p-5">
            <SectionTitle title="Environment variables" />
            <p className="text-xs leading-relaxed text-slate-500">Secure variable storage is not connected yet. Add secrets only after access controls are implemented.</p>
            <Button className="mt-4 w-full" size="sm" variant="secondary" disabled>
              <Plus size={12} />
              Add variable
            </Button>
          </Panel>
          <Panel className="p-5">
            <SectionTitle title="Deployment protection" />
            <div className="flex items-start gap-3">
              <span className="grid size-8 place-items-center rounded-md bg-amber-50 text-amber-700">
                <LockKeyhole size={15} />
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {environment.protection}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                  {environment.name === "Production"
                    ? "Only workspace admins can deploy to this environment."
                    : "Deployments follow the workspace access policy."}
                </p>
              </div>
            </div>
            <button className="mt-4 w-full rounded-md border border-slate-200 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">
              Configure protection
            </button>
          </Panel>
        </div>
      </div>
    </>
  );
}

function ActivityPage() {
  const { activity, loading, error } = useWorkspaceData();
  const [filter, setFilter] = useState("All activity");
  const filtered = activity.filter(
    (item) =>
      filter === "All activity" ||
      (filter === "Deployments" && item.type === "deploy") ||
      (filter === "Projects" && item.type === "project") ||
      (filter === "Settings" && item.type === "settings"),
  );
  const iconFor = (type: string) =>
    type === "deploy"
      ? Zap
      : type === "commit"
        ? GitBranch
        : type === "settings"
          ? Settings2
          : Boxes;
  return (
    <>
      <PageHeading
        title="Activity"
        description="A timeline of changes across your projects and deployments."
        action={
          <Button variant="secondary">
            <Filter size={14} />
            Filter activity
          </Button>
        }
      />
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800"
        >
          {error}
        </p>
      )}
      <div className="mb-5 flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
        {["All activity", "Deployments", "Projects", "Settings"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={cn(
              "rounded-md px-3 py-1.5 text-[11px] font-medium",
              filter === item
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-50",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <Panel className="p-5 md:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Recent activity
          </h2>
          <span className="text-[10px] text-slate-400">Last 30 days</span>
        </div>
        <div className="relative space-y-0 before:absolute before:bottom-7 before:left-[15px] before:top-4 before:w-px before:bg-slate-200">
          {filtered.map((item, index) => {
            const Icon = iconFor(item.type);
            return (
              <div
                key={`${item.actor}-${item.time}`}
                className="relative flex gap-4 pb-7 last:pb-1"
              >
                <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500">
                  <Icon size={14} />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-xs leading-relaxed text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {item.actor}
                    </span>{" "}
                    {item.action}{" "}
                    <Link
                      href={
                        item.type === "deploy" ? "/deployments" : "/projects"
                      }
                      className="font-semibold text-sky-700 hover:underline"
                    >
                      {item.target}
                    </Link>
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {item.detail}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400">{item.time}</p>
                </div>
                <button
                  aria-label={`Activity item ${index + 1} options`}
                  className="grid size-7 place-items-center rounded-md text-slate-300 hover:bg-slate-50 hover:text-slate-600"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            {loading ? "Loading activity…" : "No activity for this filter."}
          </p>
        )}
        <div className="mt-5 border-t border-slate-100 pt-4 text-center">
          <button className="text-xs font-semibold text-sky-700 hover:text-sky-900">
            Load older activity
          </button>
        </div>
      </Panel>
    </>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState("General");
  const [saved, setSaved] = useState(false);
  const tabs = ["General", "Members", "Integrations", "Billing"];
  return (
    <>
      <PageHeading
        title="Settings"
        description="Manage your workspace, team, and connected services."
      />
      <div className="grid items-start gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <nav
          className="flex gap-1 overflow-x-auto lg:flex-col"
          aria-label="Settings sections"
        >
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => {
                setTab(item);
                setSaved(false);
              }}
              className={cn(
                "rounded-md px-3 py-2 text-left text-xs font-medium",
                tab === item
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
              )}
            >
              {item}
            </button>
          ))}
        </nav>
        {tab === "General" ? (
          <div className="space-y-5">
            <Panel className="p-5 md:p-6">
              <SectionTitle
                title="Workspace profile"
                detail="Update the name and workspace URL."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Workspace name">
                  <input defaultValue="Northstar Labs" className={fieldClass} />
                </Field>
                <Field label="Workspace URL">
                  <div className="flex">
                    <span className="flex h-10 items-center rounded-l-md border border-r-0 border-slate-200 bg-slate-50 px-3 text-xs text-slate-400">
                      cloudlane.dev/
                    </span>
                    <input
                      defaultValue="northstar-labs"
                      className={`${fieldClass} rounded-l-none`}
                    />
                  </div>
                </Field>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-[10px] text-slate-400">
                  {saved
                    ? "Changes saved just now."
                    : "Last updated by Maya Chen"}
                </p>
                <Button size="sm" onClick={() => setSaved(true)}>
                  {saved ? (
                    <>
                      <Check size={14} />
                      Saved
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </div>
            </Panel>
            <Panel className="p-5 md:p-6">
              <SectionTitle
                title="Workspace access"
                detail="Choose who can discover this workspace."
              />
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Private workspace
                  </p>
                  <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-slate-500">
                    Only invited members can view projects and deployment logs.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked="true"
                  aria-label="Private workspace"
                  className="relative h-5 w-9 shrink-0 rounded-full bg-sky-600"
                >
                  <span className="absolute right-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </Panel>
            <Panel className="flex items-center gap-3 border-rose-200 p-5">
              <span className="grid size-9 place-items-center rounded-md bg-rose-50 text-rose-700">
                <Activity size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  Delete workspace
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Permanently remove this workspace and its projects.
                </p>
              </div>
              <Button variant="danger" size="sm">
                Delete
              </Button>
            </Panel>
          </div>
        ) : (
          <Panel className="min-h-[320px] p-6">
            <SectionTitle
              title={tab}
              detail={`Manage workspace ${tab.toLowerCase()} and preferences.`}
            />
            {tab === "Members" ? (
              <div className="divide-y divide-slate-100">
                {[
                  ["Maya Chen", "maya@northstar.dev", "Owner", "MC"],
                  ["Leo Park", "leo@northstar.dev", "Admin", "LP"],
                  ["Imani Okafor", "imani@northstar.dev", "Developer", "IO"],
                ].map(([name, email, role, initials]) => (
                  <div key={email} className="flex items-center gap-3 py-3">
                    <span className="grid size-8 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                      {initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">
                        {name}
                      </p>
                      <p className="text-[10px] text-slate-400">{email}</p>
                    </div>
                    <Badge>{role}</Badge>
                    <button
                      aria-label={`${name} member options`}
                      className="text-slate-400"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-lg border border-dashed border-slate-200 p-8 text-center">
                <span className="mx-auto grid size-10 place-items-center rounded-lg bg-slate-50 text-slate-500">
                  {tab === "Integrations" ? (
                    <Github size={18} />
                  ) : (
                    <FileText size={18} />
                  )}
                </span>
                <p className="mt-3 text-xs font-semibold text-slate-800">
                  {tab === "Integrations"
                    ? "GitHub connected"
                    : "Plan and invoices"}
                </p>
                <p className="mx-auto mt-1 max-w-xs text-[11px] leading-relaxed text-slate-500">
                  {tab === "Integrations"
                    ? "Repository access is managed by the connected GitHub account."
                    : "You&apos;re on the Free workspace plan. Billing is mock-only in this preview."}
                </p>
              </div>
            )}
          </Panel>
        )}
      </div>
    </>
  );
}

function LoginPage() {
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const errorCode = new URLSearchParams(window.location.search).get("error");
    if (errorCode) {
      setAuthError(
        errorCode === "AccessDenied"
          ? "GitHub authorization was cancelled."
          : "GitHub sign-in failed. Please try again.",
      );
    }
  }, []);

  return (
    <main className="grid min-h-screen bg-[#f5f7fa] lg:grid-cols-[minmax(0,1fr)_minmax(380px,.8fr)]">
      <section className="relative hidden overflow-hidden bg-[#101923] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(14,165,233,.22),transparent_40%),linear-gradient(135deg,#101923,#142d3d)]" />
        <Link href="/" className="relative z-10 flex items-center gap-3 text-lg font-bold"><span className="grid size-8 place-items-center rounded-md bg-sky-500 text-sm font-black">C</span>CloudShip</Link>
        <div className="relative z-10 max-w-lg pb-10"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">From code to release</p><h1 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.04em]">Your GitHub projects, one shipping workspace.</h1><p className="mt-4 max-w-md text-sm leading-6 text-slate-300">Sign in to import repositories, configure builds, and track deployments.</p></div>
        <p className="relative z-10 text-[10px] text-slate-500">CloudShip · GitHub-powered project delivery</p>
      </section>
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-bold text-slate-900 lg:hidden"><span className="grid size-8 place-items-center rounded-md bg-sky-600 text-sm font-black text-white">C</span>CloudShip</Link>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
          <Link href="/" className="mb-8 hidden items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-800 lg:inline-flex"><ArrowLeft size={14} />Back to CloudShip</Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700">Welcome back</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-950">Sign in to your workspace</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Continue with GitHub to access your projects and repositories.</p>
          {authError && <p role="alert" className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-relaxed text-rose-800">{authError}</p>}
          <button onClick={() => void signIn("github", { callbackUrl: "/" })} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"><Github size={17} />Continue with GitHub</button>
        </div>
        <p className="mx-auto w-full max-w-[420px] pb-4 text-[10px] leading-relaxed text-slate-400">By continuing, you authorize CloudShip to access your GitHub account according to the requested OAuth permissions.</p>
      </section>
    </main>
  );
}

export function AppPage({ route }: { route: string }) {
  if (route === "login") return <LoginPage />;
  if (route === "") return <DashboardPage />;
  if (route === "projects") return <ProjectsPage />;
  if (route === "projects/new") return <CreateProjectPage />;
  if (route.startsWith("projects/"))
    return <ProjectDetailPage projectId={route.slice("projects/".length)} />;
  if (route === "deployments") return <DeploymentsPage />;
  if (route.startsWith("deployments/"))
    return (
      <DeploymentDetailPage deploymentId={route.slice("deployments/".length)} />
    );
  if (route === "environments") return <EnvironmentsPage />;
  if (route === "activity") return <ActivityPage />;
  if (route === "settings") return <SettingsPage />;
  return (
    <div className="py-20 text-center text-sm text-slate-500">
      Page not found
    </div>
  );
}
