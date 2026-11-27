"use client";

export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-serif text-3xl">Something went wrong</h1>
      <p className="mt-4 text-mocha/75">The page could not be loaded. Your enquiry was not sent.</p>
      <button type="button" className="mt-6 underline" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
