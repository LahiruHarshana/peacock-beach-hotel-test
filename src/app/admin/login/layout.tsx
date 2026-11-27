import type { ChildrenProps } from "@/types/page-props";

export default function AdminLoginLayout({ children }: ChildrenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-mocha/70">
            <span className="h-2.5 w-2.5 rounded-full bg-mocha" />
            <span className="absolute right-[-0.125rem] top-1/2 h-px w-3 -translate-y-1/2 bg-mocha" />
          </span>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.16rem] text-mocha/75">Peacock Beach Hotel</p>
        </div>
        <h1 className="text-5xl font-medium leading-none tracking-[-0.06em]">
          Staff sign in
          <span className="font-serif font-normal italic">.</span>
        </h1>
        {children}
      </div>
    </div>
  );
}
