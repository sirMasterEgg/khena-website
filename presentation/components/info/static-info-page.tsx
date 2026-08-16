import {Accordion} from "@/presentation/components/ui/accordion";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {InfoIntro} from "@/presentation/components/info/info-intro";
import type {StaticInfoPage} from "@/infrastructure/mock/data/info-pages";

/** Halaman info statis (Jenis A) — tiga mode render, bagian 4.9 issue.md. */
export function StaticInfoPageView({page}: {page: StaticInfoPage}) {
  return (
    <>
      <InfoHero eyebrow={page.eyebrow} title={page.title} />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <InfoIntro>{page.intro}</InfoIntro>

        {page.mode === "prose" ? (
          <div className="space-y-10">
            {page.sections.map((section) => (
              <div
                key={section.title}
                className="grid grid-cols-1 gap-4 border-t border-hairline pt-8 md:grid-cols-[220px_1fr]"
              >
                <h2 className="text-sm uppercase tracking-label">{section.title}</h2>
                <p className="text-base text-muted">{section.body}</p>
              </div>
            ))}
          </div>
        ) : null}

        {page.mode === "accordion" ? (
          <div>
            {page.sections.map((section) => (
              <Accordion key={section.title} title={section.title}>
                {section.body}
              </Accordion>
            ))}
          </div>
        ) : null}

        {page.mode === "cards" ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {page.sections.map((section, index) => (
              <div key={section.title} className="border border-hairline p-8">
                <p className="font-display text-h3 text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 text-lg">{section.title}</h2>
                <p className="mt-2 text-sm text-muted">{section.body}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
