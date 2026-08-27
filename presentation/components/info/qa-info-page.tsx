import {Accordion} from "@/presentation/components/ui/accordion";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {InfoIntro} from "@/presentation/components/info/info-intro";
import type {QaItem} from "@/domain/entities/info-content";

export type QaInfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  items: QaItem[];
};

/**
 * Halaman info sederhana berbentuk accordion `items` — dipakai `/info/shipping`
 * dan `/info/returns` (issue #27), menggantikan mode `prose`/`accordion` di
 * `static-info-page.tsx` sekarang isinya sudah pindah ke CMS.
 */
export function QaInfoPage({eyebrow, title, intro, items}: QaInfoPageProps) {
  return (
    <>
      <InfoHero eyebrow={eyebrow} title={title} />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <InfoIntro>{intro}</InfoIntro>

        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">Nothing to show here yet.</p>
        ) : (
          <div>
            {items.map((item) => (
              <Accordion key={item.id} title={item.question}>
                {item.answer}
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
