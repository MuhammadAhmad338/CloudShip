export type DeploymentStatus = "Live" | "Building" | "Queued" | "Failed";
export type ProjectStatus = DeploymentStatus | "Ready";

export type Project = {
  id: string;
  name: string;
  repository: string;
  framework: string;
  environment: string;
  status: ProjectStatus;
  updated: string;
  initials: string;
  color: string;
  branch?: string;
  buildCommand?: string;
  startCommand?: string;
  rootDirectory?: string;
};

export type Deployment = {
  id: string;
  project: string;
  projectId: string;
  branch: string;
  commit: string;
  message: string;
  status: DeploymentStatus | "Testing" | "Deploying";
  environment: string;
  created: string;
  duration: string;
  author: string;
  logs?: string;
};

export const projects: Project[] = [
  {
    id: "atlas-storefront",
    name: "Atlas Storefront",
    repository: "northstar/atlas-storefront",
    framework: "Next.js",
    environment: "Production",
    status: "Live",
    updated: "2 min ago",
    initials: "AS",
    color: "sky",
  },
  {
    id: "orbit-api",
    name: "Orbit API",
    repository: "northstar/orbit-api",
    framework: "Node.js",
    environment: "Production",
    status: "Building",
    updated: "8 min ago",
    initials: "OA",
    color: "violet",
  },
  {
    id: "field-notes",
    name: "Field Notes",
    repository: "northstar/field-notes",
    framework: "React",
    environment: "Staging",
    status: "Live",
    updated: "1 hour ago",
    initials: "FN",
    color: "emerald",
  },
  {
    id: "compass-mobile",
    name: "Compass Mobile",
    repository: "northstar/compass-mobile",
    framework: "Flutter Web",
    environment: "Development",
    status: "Failed",
    updated: "3 hours ago",
    initials: "CM",
    color: "amber",
  },
  {
    id: "ledger-service",
    name: "Ledger Service",
    repository: "northstar/ledger-service",
    framework: "Node.js",
    environment: "Production",
    status: "Live",
    updated: "Yesterday",
    initials: "LS",
    color: "rose",
  },
];

export const deployments: Deployment[] = [
  {
    id: "dpl-8f42a1",
    project: "Atlas Storefront",
    projectId: "atlas-storefront",
    branch: "main",
    commit: "8f42a1c",
    message: "Polish checkout summary and tax breakdown",
    status: "Live",
    environment: "Production",
    created: "2 min ago",
    duration: "1m 42s",
    author: "Maya Chen",
  },
  {
    id: "dpl-3b17e9",
    project: "Orbit API",
    projectId: "orbit-api",
    branch: "feat/rate-limits",
    commit: "3b17e9d",
    message: "Add per-tenant request throttling",
    status: "Building",
    environment: "Preview",
    created: "8 min ago",
    duration: "0m 38s",
    author: "Leo Park",
  },
  {
    id: "dpl-a91c04",
    project: "Field Notes",
    projectId: "field-notes",
    branch: "main",
    commit: "a91c04f",
    message: "Update editor autosave behavior",
    status: "Live",
    environment: "Staging",
    created: "1 hour ago",
    duration: "2m 06s",
    author: "Imani Okafor",
  },
  {
    id: "dpl-5e30bb",
    project: "Compass Mobile",
    projectId: "compass-mobile",
    branch: "main",
    commit: "5e30bb2",
    message: "Fix navigation state after sign in",
    status: "Failed",
    environment: "Development",
    created: "3 hours ago",
    duration: "0m 54s",
    author: "Maya Chen",
  },
  {
    id: "dpl-c4028d",
    project: "Atlas Storefront",
    projectId: "atlas-storefront",
    branch: "main",
    commit: "c4028d7",
    message: "Add saved addresses to account settings",
    status: "Live",
    environment: "Production",
    created: "Yesterday",
    duration: "1m 38s",
    author: "Leo Park",
  },
  {
    id: "dpl-77e2a0",
    project: "Ledger Service",
    projectId: "ledger-service",
    branch: "release/2.4",
    commit: "77e2a0e",
    message: "Improve reconciliation query performance",
    status: "Live",
    environment: "Production",
    created: "Yesterday",
    duration: "1m 17s",
    author: "Imani Okafor",
  },
];

export const environments = [
  {
    name: "Production",
    slug: "production",
    color: "emerald",
    description: "Customer-facing workloads",
    projects: 3,
    protection: "Protected",
    updated: "2 min ago",
  },
  {
    name: "Staging",
    slug: "staging",
    color: "amber",
    description: "Pre-release validation",
    projects: 2,
    protection: "Approval required",
    updated: "1 hour ago",
  },
  {
    name: "Development",
    slug: "development",
    color: "sky",
    description: "Feature branches and experiments",
    projects: 4,
    protection: "Open",
    updated: "3 hours ago",
  },
];

export const activity = [
  {
    actor: "Maya Chen",
    action: "deployed",
    target: "Atlas Storefront",
    detail: "to production",
    time: "2 min ago",
    type: "deploy",
  },
  {
    actor: "Leo Park",
    action: "pushed a commit to",
    target: "Orbit API",
    detail: "feat/rate-limits",
    time: "8 min ago",
    type: "commit",
  },
  {
    actor: "Imani Okafor",
    action: "updated environment variables in",
    target: "Field Notes",
    detail: "Staging",
    time: "34 min ago",
    type: "settings",
  },
  {
    actor: "Maya Chen",
    action: "created project",
    target: "Compass Mobile",
    detail: "from northstar/compass-mobile",
    time: "Yesterday",
    type: "project",
  },
  {
    actor: "Leo Park",
    action: "deployed",
    target: "Ledger Service",
    detail: "to production",
    time: "Yesterday",
    type: "deploy",
  },
];
