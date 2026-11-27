import type { ReactNode } from "react";

export function AdminPage({
  eyebrow = "Staff",
  title,
  lede,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-5 bg-walnut" />
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.16rem] text-mocha/75">{eyebrow}</p>
          </div>
          <h1 className="text-4xl font-medium leading-none tracking-[-0.055em] sm:text-5xl">
            {title}
            <span className="font-serif font-normal italic">.</span>
          </h1>
          {lede ? <p className="mt-4 max-w-2xl text-sm leading-6 text-mocha/75">{lede}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function adminPrimaryLinkClass() {
  return "inline-flex h-11 items-center rounded-full bg-mocha px-5 text-xs font-medium uppercase tracking-[0.12rem] text-ivory transition-transform hover:-translate-y-0.5";
}

export function adminTableClass() {
  return "overflow-x-auto rounded-[1.4rem] bg-greige ring-1 ring-mocha/[0.06]";
}
