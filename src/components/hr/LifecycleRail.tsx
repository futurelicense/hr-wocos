import { cn } from "@/lib/utils";
import { lifecycle } from "@/lib/hr/data";

export function LifecycleRail() {
  return (
    <section className="console-panel animate-rise p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="console-label">Workforce Lifecycle</span>
          <span className="font-mono text-[10px] text-fg/60">16 gates</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-mute">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-teal" />
            Latched
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-amber" />
            In progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-line" />
            Queued
          </span>
        </div>
      </div>
      <div className="flex gap-1.5">
        {lifecycle.map((stage, i) => (
          <div key={stage.id} className="group min-w-0 flex-1">
            <div
              className={cn(
                "animate-latch h-1.5 rounded-full",
                stage.state === "done" ? "bg-teal" : stage.state === "active" ? "bg-amber" : "bg-line",
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            />
            <div
              className={cn(
                "mt-1.5 truncate font-mono text-[8px] tracking-wide uppercase",
                stage.state === "active" ? "text-amber" : "text-mute",
              )}
            >
              {stage.label}
            </div>
            <div className="font-mono text-[10px] text-dim tabular-nums">{stage.count}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
