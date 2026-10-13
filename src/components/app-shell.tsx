"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/components/auth-session-provider";
import { signOut } from "@/lib/store/auth-slice";
import { useAppDispatch } from "@/lib/store/hooks";
import {
    Activity,
    Bell,
    Boxes,
    ChevronDown,
    CircleHelp,
    Cloud,
    Command,
    GitBranch,
    Globe2,
    LayoutDashboard,
    Menu,
    Search,
    Settings2,
    Shield,
    X,
    Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useWorkspaceData } from "@/lib/workspace-data";
import { WorkspaceDataProvider } from "@/lib/workspace-data";

const navigation = [
    {
        label: "Overview",
        items: [
            { label: "Dashboard", href: "/", icon: LayoutDashboard },
            { label: "Projects", href: "/projects", icon: Boxes },
            { label: "Deployments", href: "/deployments", icon: Zap },
        ],
    },
    {
        label: "Delivery",
        items: [{ label: "Environments", href: "/environments", icon: Globe2 }],
    },
    {
        label: "Workspace",
        items: [
            { label: "Activity", href: "/activity", icon: Activity },
            { label: "Settings", href: "/settings", icon: Settings2 },
        ],
    },
];

const shortcuts = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Projects", href: "/projects", icon: Boxes },
    { label: "New project", href: "/projects/new", icon: GitBranch },
    { label: "Deployments", href: "/deployments", icon: Zap },
    { label: "Environments", href: "/environments", icon: Globe2 },
    { label: "Activity", href: "/activity", icon: Activity },
    { label: "Settings", href: "/settings", icon: Settings2 },
];

export function AppShell({ children }: { children: ReactNode }) {
    const { status } = useSession();
    if (status !== "authenticated") return <>{children}</>;
    return <WorkspaceDataProvider><AuthenticatedShell>{children}</AuthenticatedShell></WorkspaceDataProvider>;
}

function AuthenticatedShell({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const { loading, error } = useWorkspaceData();
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const pageLabel =
        navigation
            .flatMap((group) => group.items)
            .find((item) => item.href === pathname)?.label ??
        (pathname.includes("/projects/new")
            ? "Create project"
            : pathname.includes("/projects/")
                ? "Project details"
                : pathname.includes("/deployments/")
                    ? "Deployment details"
                    : "Cloudlane");
    const results = shortcuts.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
    );

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setSearchOpen((open) => !open);
            }
            if (event.key === "Escape") {
                setSearchOpen(false);
                setMenuOpen(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => setMenuOpen(false), [pathname]);

    return (
        <div className="min-h-screen bg-[#f6f8fb]">
            {menuOpen && (
                <button
                    aria-label="Close navigation"
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
                />
            )}
            <aside
                className={cn(
                    "sidebar-scroll fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col overflow-y-auto bg-[#101923] text-slate-300 transition-transform duration-200 lg:translate-x-0",
                    menuOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex h-[68px] items-center justify-between border-b border-white/[0.08] px-5">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                        aria-label="Cloudlane dashboard"
                    >
                        <span className="grid size-8 place-items-center rounded-lg bg-[#0785d1] text-white shadow-[0_4px_12px_rgba(0,120,212,.28)]">
                            <Cloud size={18} strokeWidth={2.4} />
                        </span>
                        <span className="text-[17px] font-bold tracking-[-0.035em] text-white">
                            cloudlane<span className="text-sky-400">.</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                        className="grid size-8 place-items-center rounded-md text-slate-400 hover:bg-white/10 lg:hidden"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="px-3 pt-4">
                    <button className="flex w-full items-center gap-3 rounded-lg border border-white/[0.09] bg-white/[0.045] px-3 py-2.5 text-left hover:bg-white/[0.075]">
                        <span className="grid size-8 place-items-center rounded-md bg-slate-700/80 text-xs font-bold text-slate-100">
                            N
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12px] font-semibold text-slate-100">
                                Northstar Labs
                            </span>
                            <span className="mt-0.5 block text-[10px] text-slate-400">
                                Free workspace
                            </span>
                        </span>
                        <ChevronDown size={14} className="text-slate-500" />
                    </button>
                </div>

                <nav className="flex-1 px-3 pb-4 pt-6" aria-label="Primary navigation">
                    {navigation.map((group) => (
                        <div key={group.label} className="mb-6">
                            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                {group.label}
                            </p>
                            <div className="space-y-1">
                                {group.items.map(({ label, href, icon: Icon }) => {
                                    const active =
                                        href === "/"
                                            ? pathname === "/"
                                            : pathname === href || pathname.startsWith(`${href}/`);
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            className={cn(
                                                "group flex h-9 items-center gap-3 rounded-md px-3 text-[13px] font-medium transition-colors",
                                                active
                                                    ? "bg-[#183b56] text-white"
                                                    : "text-slate-400 hover:bg-white/[0.055] hover:text-slate-100",
                                            )}
                                        >
                                            <Icon
                                                size={16}
                                                strokeWidth={active ? 2.2 : 1.8}
                                                className={
                                                    active
                                                        ? "text-sky-300"
                                                        : "text-slate-500 group-hover:text-slate-300"
                                                }
                                            />
                                            {label}
                                            {label === "Deployments" && (
                                                <span className="ml-auto rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                                                    2
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 rounded-lg border border-sky-400/15 bg-[#132c3d] p-3.5">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="grid size-7 place-items-center rounded-md bg-sky-400/10 text-sky-300">
                                <Shield size={15} />
                            </span>
                            <span className={cn("size-1.5 rounded-full", error ? "bg-rose-400" : loading ? "bg-amber-400" : "bg-emerald-400")} />
                        </div>
                        <p className="text-xs font-semibold text-slate-100">
                            Deployment platform
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                            Northstar workspace
                        </p>
                        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-emerald-300">
                            <span className="size-1.5 rounded-full bg-emerald-400" />
                            {error ? "API unavailable" : loading ? "Checking backend" : "API connected"}
                        </div>
                    </div>
                </nav>

                <div className="border-t border-white/[0.08] p-3">
                    <button onClick={() => void dispatch(signOut()).unwrap().then(() => {
                        window.location.assign("/");
                    }).catch((error: unknown) => {
                        console.error("GitHub sign-out failed", error);
                        window.location.assign("/login?error=SignOut");
                    })} aria-label="Sign out of GitHub" title="Sign out" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-white/[0.05]">
                        <span className="grid size-8 place-items-center rounded-full bg-[#d8e9f7] text-[11px] font-bold text-[#214e70]">
                            {(session?.user?.name ?? session?.user?.email ?? "GH").split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-slate-200">
                                {session?.user?.name ?? "GitHub member"}
                            </span>
                            <span className="block truncate text-[10px] text-slate-500">
                                {session?.user?.email ?? "GitHub account"}
                            </span>
                        </span>
                        <ChevronDown size={14} className="text-slate-500" />
                    </button>
                </div>
            </aside>

            <div className="min-h-screen lg:pl-[252px]">
                <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 backdrop-blur md:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open navigation"
                            className="grid size-9 shrink-0 place-items-center rounded-md text-slate-600 hover:bg-slate-100 lg:hidden"
                        >
                            <Menu size={19} />
                        </button>
                        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                            <span>Northstar Labs</span>
                            <span>/</span>
                            <span className="font-semibold text-slate-700">{pageLabel}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-800 sm:hidden">
                            {pageLabel}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="hidden h-9 w-[220px] items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-left text-xs text-slate-400 hover:border-slate-300 hover:bg-white md:flex"
                            aria-label="Search pages"
                        >
                            <Search size={14} />
                            <span className="flex-1">Search anything...</span>
                            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                                ⌘ K
                            </kbd>
                        </button>
                        <button
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                            className="grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100 md:hidden"
                        >
                            <Search size={17} />
                        </button>
                        <button
                            aria-label="Help and support"
                            className="hidden size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100 sm:grid"
                        >
                            <CircleHelp size={17} />
                        </button>
                        <button
                            aria-label="Notifications"
                            className="relative grid size-9 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                        >
                            <Bell size={17} />
                            <span className="absolute right-[8px] top-[7px] size-1.5 rounded-full border border-white bg-sky-500" />
                        </button>
                        <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
                        <button className="hidden items-center gap-2 rounded-md px-1.5 py-1 text-left sm:flex">
                            <span className="size-2 rounded-full bg-sky-500" />
                            <span className="text-xs font-medium text-slate-600">
                                Production
                            </span>
                            <ChevronDown size={13} className="text-slate-400" />
                        </button>
                    </div>
                </header>
                <main className="mx-auto w-full max-w-[1500px] px-4 py-7 md:px-8 md:py-8">
                    {children}
                </main>
            </div>

            {searchOpen && (
                <div
                    className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/40 px-4 pt-[16vh]"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setSearchOpen(false);
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Search Cloudlane"
                        className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
                    >
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4">
                            <Search size={17} className="text-slate-400" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search pages and projects..."
                                className="h-12 min-w-0 flex-1 text-sm outline-none placeholder:text-slate-400"
                            />
                            <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400">
                                ESC
                            </kbd>
                        </div>
                        <div className="p-2">
                            <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Quick navigation
                            </p>
                            {results.length ? (
                                results.map(({ label, href, icon: Icon }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setSearchOpen(false)}
                                        className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <Icon size={16} className="text-slate-400" />
                                        {label}
                                        <span className="ml-auto text-[10px] text-slate-400">
                                            Go to page
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <p className="px-2.5 py-5 text-sm text-slate-500">
                                    No pages match “{query}”.
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400">
                            <Command size={12} />
                            Press{" "}
                            <kbd className="rounded border border-slate-200 px-1">⌘ K</kbd> to
                            open search
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
