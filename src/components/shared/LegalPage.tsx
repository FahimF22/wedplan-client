export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <section className="container-page max-w-3xl py-14">
      <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>
      <div className="mt-8 space-y-6 leading-relaxed text-foreground/85 [&_h2]:mt-8 [&_h2]:font-sans [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </section>
  );
}
