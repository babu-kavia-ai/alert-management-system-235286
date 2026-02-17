import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6">
      <section className="w-full max-w-lg card" role="alert" aria-live="assertive">
        <div className="card-body">
          <h1 className="text-xl font-semibold">404 – Page Not Found</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            The page you’re looking for doesn’t exist.
          </p>

          <div className="mt-5">
            <Link
              href="/"
              className="inline-flex rounded-xl border border-[var(--border)] px-4 py-2 text-sm hover:bg-white"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
