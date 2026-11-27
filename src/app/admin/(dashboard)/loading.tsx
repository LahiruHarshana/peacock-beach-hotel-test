export default function AdminLoading() {
  return (
    <div className="px-5 py-8 sm:px-8 lg:px-10" aria-busy="true" aria-live="polite">
      <div className="h-3 w-24 animate-pulse rounded-full bg-mocha/10" />
      <div className="mt-5 h-12 w-64 animate-pulse rounded-2xl bg-mocha/10" />
      <div className="mt-8 h-40 animate-pulse rounded-[1.4rem] bg-mocha/5" />
    </div>
  );
}
