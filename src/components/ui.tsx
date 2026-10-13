import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                primary: "bg-sky-600 text-white shadow-sm hover:bg-sky-700",
                secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                danger: "bg-rose-600 text-white hover:bg-rose-700",
            },
            size: {
                default: "h-9 px-3.5",
                sm: "h-8 px-3 text-xs",
                icon: "size-9 p-0",
            },
        },
        defaultVariants: { variant: "primary", size: "default" },
    },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
    return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

export function ButtonLink({ className, variant, size, children, ...props }: ButtonProps & { href: string; children: ReactNode }) {
    const { href, ...rest } = props;
    return <a href={href} className={cn(buttonStyles({ variant, size }), className)} {...(rest as HTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
}

const badgeStyles = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none", {
    variants: {
        tone: {
            success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
            warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
            danger: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200",
            info: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
            neutral: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
        },
    },
    defaultVariants: { tone: "neutral" },
});

export function Badge({ className, tone, children }: { className?: string; tone?: "success" | "warning" | "danger" | "info" | "neutral"; children: ReactNode }) {
    return <span className={cn(badgeStyles({ tone }), className)}>{children}</span>;
}

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]", className)} {...props} />;
}

export function PageHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
    return <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-[26px] font-bold tracking-[-0.03em] text-slate-950">{title}</h1><p className="mt-1.5 text-sm text-slate-500">{description}</p></div>
        {action}
    </div>;
}

export function SectionTitle({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
    return <div className="mb-4 flex items-center justify-between gap-3">
        <div><h2 className="text-sm font-semibold text-slate-900">{title}</h2>{detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}</div>{action}
    </div>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
    return <label className="block space-y-2"><span className="block text-sm font-medium text-slate-700">{label}</span>{children}{hint && <span className="block text-xs text-slate-500">{hint}</span>}</label>;
}

export const fieldClass = "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100";

export function StatusBadge({ status }: { status: string }) {
    const tone = status === "Live" || status === "Running" || status === "Healthy" ? "success" : status === "Building" || status === "Queued" || status === "Approval required" ? "warning" : status === "Failed" ? "danger" : status === "Connected" ? "info" : "neutral";
    return <Badge tone={tone}><span className={cn("size-1.5 rounded-full", tone === "success" ? "bg-emerald-500" : tone === "warning" ? "bg-amber-500" : tone === "danger" ? "bg-rose-500" : tone === "info" ? "bg-sky-500" : "bg-slate-400")} />{status}</Badge>;
}