"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Deployment, Project, ProjectStatus } from "@/lib/data";

type ApiProject = Omit<Project, "updated" | "initials" | "color"> & {
  createdAt: string;
  updatedAt: string;
};

type ApiDeployment = {
  id: string;
  projectId: string;
  projectName: string;
  branch: string;
  commitSha: string | null;
  commitMessage: string;
  status: Deployment["status"];
  environment: string;
  author: string;
  logs?: string;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
};

type ApiEnvironment = { name: string; protection: string };
type ApiActivity = {
  id: string;
  projectId: string | null;
  projectName: string | null;
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
};

export type EnvironmentView = ApiEnvironment & {
  slug: string;
  color: string;
  description: string;
  projects: number;
  updated: string;
};

export type ActivityView = ApiActivity & {
  target: string;
  time: string;
  type: "deploy" | "project" | "settings" | "commit";
};

export type NewProjectInput = {
  name: string;
  repository: string;
  framework: string;
  environment: string;
  branch: string;
  buildCommand: string;
  startCommand: string;
  rootDirectory: string;
};

export type WorkspaceData = {
  projects: Project[];
  deployments: Deployment[];
  environments: EnvironmentView[];
  activity: ActivityView[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createProject: (input: NewProjectInput) => Promise<Project>;
  createDeployment: (projectId: string) => Promise<void>;
};

const WorkspaceDataContext = createContext<WorkspaceData | null>(null);

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/workspace/${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String(payload.error)
        : `Backend request failed (${response.status}).`;
    throw new Error(message);
  }
  return payload as T;
}

function relativeTime(value: string) {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function projectInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function toProject(record: ApiProject): Project {
  return {
    ...record,
    status: record.status as ProjectStatus,
    updated: relativeTime(record.updatedAt),
    initials: projectInitials(record.name),
    color: "sky",
  };
}

function deploymentDuration(
  startedAt: string | null,
  finishedAt: string | null,
) {
  if (!startedAt || !finishedAt) return "—";
  const seconds = Math.max(
    0,
    Math.round((Date.parse(finishedAt) - Date.parse(startedAt)) / 1000),
  );
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

function toDeployment(record: ApiDeployment): Deployment {
  return {
    id: record.id,
    projectId: record.projectId,
    project: record.projectName,
    branch: record.branch,
    commit: record.commitSha ?? "—",
    message: record.commitMessage,
    status: record.status,
    environment: record.environment,
    created: relativeTime(record.createdAt),
    duration: deploymentDuration(record.startedAt, record.finishedAt),
    author: record.author,
    logs: record.logs,
  };
}

function toActivity(record: ApiActivity): ActivityView {
  const type = record.action.includes("deployment")
    ? "deploy"
    : record.action.includes("project")
      ? "project"
      : record.action.includes("commit")
        ? "commit"
        : "settings";
  return {
    ...record,
    target: record.projectName ?? "Workspace",
    time: relativeTime(record.createdAt),
    type,
  };
}

const environmentDetails: Record<
  string,
  Pick<EnvironmentView, "slug" | "color" | "description">
> = {
  Production: {
    slug: "production",
    color: "emerald",
    description: "Customer-facing workloads",
  },
  Staging: {
    slug: "staging",
    color: "amber",
    description: "Pre-release validation",
  },
  Development: {
    slug: "development",
    color: "sky",
    description: "Feature branches and experiments",
  },
};

export function WorkspaceDataProvider({ children }: { children: ReactNode }) {
  const [revision, setRevision] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [environments, setEnvironments] = useState<EnvironmentView[]>([]);
  const [activity, setActivity] = useState<ActivityView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    Promise.all([
      apiRequest<ApiProject[]>("projects", { signal: controller.signal }),
      apiRequest<ApiDeployment[]>("deployments", { signal: controller.signal }),
      apiRequest<ApiEnvironment[]>("environments", {
        signal: controller.signal,
      }),
      apiRequest<ApiActivity[]>("activity", { signal: controller.signal }),
    ])
      .then(
        ([
          projectRecords,
          deploymentRecords,
          environmentRecords,
          activityRecords,
        ]) => {
          const nextProjects = projectRecords.map(toProject);
          setProjects(nextProjects);
          setDeployments(deploymentRecords.map(toDeployment));
          setEnvironments(
            environmentRecords.map((record) => {
              const details = environmentDetails[record.name] ?? {
                slug: record.name.toLowerCase(),
                color: "sky",
                description: "Project environment",
              };
              return {
                ...details,
                ...record,
                projects: nextProjects.filter(
                  (project) => project.environment === record.name,
                ).length,
                updated: relativeTime(
                  deploymentRecords.find(
                    (deployment) => deployment.environment === record.name,
                  )?.createdAt ?? new Date().toISOString(),
                ),
              };
            }),
          );
          setActivity(activityRecords.map(toActivity));
          setError(null);
        },
      )
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load workspace data.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [revision]);

  const refresh = () => setRevision((value) => value + 1);

  async function createProject(input: NewProjectInput) {
    const record = await apiRequest<ApiProject>("projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
    refresh();
    return toProject(record);
  }

  async function createDeployment(projectId: string) {
    await apiRequest("deployments", {
      method: "POST",
      body: JSON.stringify({ projectId }),
    });
    refresh();
  }

  return (
    <WorkspaceDataContext.Provider
      value={{
        projects,
        deployments,
        environments,
        activity,
        loading,
        error,
        refresh,
        createProject,
        createDeployment,
      }}
    >
      {children}
    </WorkspaceDataContext.Provider>
  );
}

export function useWorkspaceData() {
  const value = useContext(WorkspaceDataContext);
  if (!value)
    throw new Error(
      "useWorkspaceData must be used within WorkspaceDataProvider.",
    );
  return value;
}
