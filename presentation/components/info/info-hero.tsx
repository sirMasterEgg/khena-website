export type InfoHeroProps = {
  eyebrow: string;
  title: string;
};

/** Hero pendek untuk halaman /info/[slug] — bagian 4.9 issue.md. */
export function InfoHero({eyebrow, title}: InfoHeroProps) {
  return (
    <div className="pt-20 text-center lg:pt-30">
      <p className="text-eyebrow uppercase tracking-eyebrow text-muted">{eyebrow}</p>
      <h1 className="mt-4 font-display text-h1">{title}</h1>
    </div>
  );
}
