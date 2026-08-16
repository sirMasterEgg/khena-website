// Halaman uji sementara untuk verifikasi visual token desain ISSUE-01.
// Boleh dihapus begitu ISSUE-02 (komponen primitif) selesai.

const COLORS = [
  {name: "cream", className: "bg-cream text-ink"},
  {name: "warm", className: "bg-warm text-ink"},
  {name: "warm-2", className: "bg-warm-2 text-ink"},
  {name: "ink", className: "bg-ink text-invert"},
  {name: "ink-soft", className: "bg-ink-soft text-invert"},
  {name: "muted", className: "bg-muted text-invert"},
  {name: "hairline", className: "bg-hairline text-ink"},
  {name: "faint", className: "bg-faint text-ink"},
  {name: "tile", className: "bg-tile text-ink"},
  {name: "accent", className: "bg-accent text-invert"},
  {name: "danger", className: "bg-danger text-invert"},
] as const;

export default function StyleTestPage() {
  return (
    <main className="mx-auto max-w-355 space-y-14 p-10">
      <section className="space-y-4">
        <h2 className="font-display text-h3">Palet Warna</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {COLORS.map((c) => (
            <div
              key={c.name}
              className={`${c.className} flex h-20 items-end border border-hairline p-2 text-xs`}
            >
              {c.name}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-h3">Skala Tipografi</h2>
        <p className="font-display text-hero">Hero 108</p>
        <h1 className="font-display text-h1">Heading 1</h1>
        <h2 className="font-display text-h2">Heading 2</h2>
        <h3 className="font-display text-h3">Heading 3</h3>
        <p className="font-display text-lead max-w-180">
          Lead paragraph — dipakai untuk paragraf pembuka halaman /info.
        </p>
        <p className="text-body-lg">Body large 20px.</p>
        <p className="text-base">Body default 16px.</p>
        <p className="text-eyebrow uppercase tracking-eyebrow">Eyebrow label</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-h3">Tracking</h2>
        <p className="text-sm uppercase tracking-button">tracking-button</p>
        <p className="text-sm uppercase tracking-label">tracking-label</p>
        <p className="text-sm uppercase tracking-eyebrow">tracking-eyebrow</p>
        <p className="font-display text-2xl uppercase tracking-wordmark">
          KHENA
        </p>
      </section>
    </main>
  );
}
