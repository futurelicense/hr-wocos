import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { labelize, toneClasses, toneBar, toneFor, type Tone } from "@/lib/hr/status";

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: string;
  tone?: Tone;
  className?: string;
}) {
  const t = tone ?? toneFor(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap ring-1",
        toneClasses[t],
        className,
      )}
    >
      {labelize(status)}
    </span>
  );
}

export function Dot({ tone }: { tone: Tone }) {
  return <span className={cn("size-1.5 shrink-0 rounded-full", toneBar[tone])} />;
}

export function Panel({
  title,
  meta,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("console-panel animate-rise flex flex-col", className)}>
      {(title || meta || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="font-display text-[14px] font-medium">{title}</h2>
          <div className="flex items-center gap-2">
            {meta ? <span className="font-mono text-[10px] text-mute">{meta}</span> : null}
            {action}
          </div>
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatTile({
  label,
  value,
  note,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  note?: string;
  tone?: Tone;
}) {
  const ring: Record<Tone, string> = {
    success: "hover:ring-teal/40",
    warning: "hover:ring-amber/40",
    danger: "hover:ring-coral/40",
    info: "hover:ring-sky/40",
    neutral: "hover:ring-line",
  };
  const noteColor: Record<Tone, string> = {
    success: "text-teal",
    warning: "text-amber",
    danger: "text-coral",
    info: "text-sky",
    neutral: "text-dim",
  };
  return (
    <div
      className={cn(
        "animate-rise rounded-lg bg-panel p-3.5 ring-1 ring-line transition-transform hover:-translate-y-px",
        ring[tone],
      )}
    >
      <div className="console-label truncate">{label}</div>
      <div className="numeral mt-2 text-[26px] leading-none">{value}</div>
      {note ? <div className={cn("mt-2 font-mono text-[10px]", noteColor[tone])}>{note}</div> : null}
    </div>
  );
}

export function PageHeader({
  section,
  title,
  subtitle,
  actions,
}: {
  section: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="console-label">{section}</div>
        <h1 className="font-display mt-1.5 text-[22px] leading-none font-semibold">{title}</h1>
        {subtitle ? <p className="mt-2 font-mono text-[11px] text-mute">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function ConsoleButton({
  children,
  variant = "ghost",
  className,
}: {
  children: ReactNode;
  variant?: "ghost" | "primary";
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "h-9 rounded-md px-3.5 text-[13px] font-medium transition-colors",
        variant === "primary"
          ? "bg-teal text-ink ring-1 ring-teal hover:bg-teal/90"
          : "bg-panel2 text-dim ring-1 ring-line hover:text-fg",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function FilterBar({ filters, right }: { filters: string[]; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f, i) => (
        <button
          key={f}
          type="button"
          className={cn(
            "h-8 rounded-md px-2.5 font-mono text-[11px] ring-1 transition-colors",
            i === 0 ? "bg-teal/10 text-teal ring-teal/25" : "bg-panel2 text-mute ring-line hover:text-fg",
          )}
        >
          {f}
        </button>
      ))}
      {right ? <div className="ml-auto flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  widths,
}: {
  columns: string[];
  rows: ReactNode[][];
  widths?: string[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {columns.map((c, i) => (
              <th
                key={c}
                className="console-label px-3 py-2 font-normal whitespace-nowrap"
                style={widths?.[i] ? { width: widths[i] } : undefined}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b border-line/60 text-[12.5px] transition-colors last:border-0 hover:bg-panel2/60">
              {r.map((cell, ci) => (
                <td key={ci} className="px-3 py-2.5 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BarList({
  items,
  unit,
  tone = "success",
}: {
  items: { label: string; value: number }[];
  unit?: string;
  tone?: Tone;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2.5 font-mono text-[11px]">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-28 truncate text-dim">{item.label}</span>
          <div className="h-2 flex-1 rounded-full bg-line">
            <div
              className={cn("animate-latch h-full rounded-full", toneBar[tone])}
              style={{ width: `${(item.value / max) * 100}%`, animationDelay: `${i * 50}ms` }}
            />
          </div>
          <span className="w-10 text-right text-fg">
            {item.value}
            {unit ? <span className="text-mute">{unit}</span> : null}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ColumnChart({
  items,
  height = "h-32",
}: {
  items: { label: string; value: number; tone?: Tone }[];
  height?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className={cn("flex items-stretch gap-2", height)}>
      {items.map((item) => (
        <div key={item.label} className="flex h-full flex-1 flex-col items-center gap-1.5">
          <div className="flex w-full flex-1 items-end">
            <div
              className={cn("animate-latch w-full rounded-t-[4px]", toneBar[item.tone ?? "info"])}
              style={{ height: `${Math.max((item.value / max) * 100, 4)}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-fg">{item.value}</span>
          <span className="font-mono text-[8px] tracking-wide text-mute uppercase">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Progress({ value, tone = "success" }: { value: number; tone?: Tone }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-line">
      <div className={cn("animate-latch h-full rounded-full", toneBar[tone])} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Checklist({
  items,
}: {
  items: { label: string; status: string }[];
}) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const tone = toneFor(item.status);
        return (
          <li key={item.label} className="flex items-center justify-between gap-3 border-b border-line/60 py-1.5 last:border-0">
            <span className="flex items-center gap-2.5 text-[12.5px]">
              <Dot tone={tone} />
              {item.label}
            </span>
            <StatusBadge status={item.status} />
          </li>
        );
      })}
    </ul>
  );
}

export function Timeline({ items }: { items: { time: string; text: string; actor?: string }[] }) {
  return (
    <ol className="relative space-y-3 pl-4">
      <span className="absolute top-1 bottom-1 left-[3px] w-px bg-line" />
      {items.map((item) => (
        <li key={item.time + item.text} className="relative">
          <span className="absolute top-1.5 -left-4 size-1.5 rounded-full bg-teal ring-2 ring-panel" />
          <div className="text-[12.5px] text-fg">{item.text}</div>
          <div className="font-mono text-[10px] text-mute">
            {item.time}
            {item.actor ? ` · ${item.actor}` : ""}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function KeyValue({ rows }: { rows: { k: string; v: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-line/60">
      {rows.map((r) => (
        <div key={r.k} className="flex items-baseline justify-between gap-4 py-2">
          <dt className="console-label">{r.k}</dt>
          <dd className="text-right text-[12.5px]">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Tabs({ tabs }: { tabs: string[] }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-line pb-px">
      {tabs.map((t, i) => (
        <button
          key={t}
          type="button"
          className={cn(
            "-mb-px rounded-t-md border-b-2 px-3 py-2 text-[12.5px] transition-colors",
            i === 0 ? "border-teal text-fg" : "border-transparent text-mute hover:text-dim",
          )}
        >
          {labelize(t)}
        </button>
      ))}
    </div>
  );
}

export function DemoNote({ children }: { children?: ReactNode }) {
  return (
    <p className="font-mono text-[10px] tracking-[0.1em] text-mute uppercase">
      {children ?? "Illustrative demo data — not operational"}
    </p>
  );
}
