import {InfoHero} from "@/presentation/components/info/info-hero";
import {CatalogueLeadForm} from "@/presentation/components/info/catalogue-lead-form";
import {CATALOGUE_META} from "@/infrastructure/mock/data/info-pages";

/** Halaman /info/catalogue — download di-gate form lead (bagian 4.9 issue.md). */
export function CataloguePage() {
  return (
    <>
      <InfoHero eyebrow="Professionals" title="Catalogue" />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-center">
            <div className="relative aspect-[383/468] w-full max-w-70 overflow-hidden bg-ink">
              <div className="absolute inset-y-0 left-0 w-2 bg-black/30" aria-hidden="true" />
              <div className="flex h-full flex-col items-center justify-center px-6 text-center text-invert">
                <p className="text-xs uppercase tracking-wordmark">Khena</p>
                <p className="mt-4 font-display text-2xl">The Catalogue</p>
                <p className="mt-2 text-xs uppercase tracking-eyebrow">{CATALOGUE_META.edition}</p>
              </div>
            </div>

            <dl className="mt-8 grid w-full max-w-70 grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted">Edition</dt>
              <dd>{CATALOGUE_META.edition}</dd>
              <dt className="text-muted">Pages</dt>
              <dd>{CATALOGUE_META.pages}</dd>
              <dt className="text-muted">Format</dt>
              <dd>{CATALOGUE_META.format}</dd>
              <dt className="text-muted">File Size</dt>
              <dd>{CATALOGUE_META.fileSize}</dd>
            </dl>
          </div>

          <div>
            <h2 className="font-display text-h3">Download the Catalogue</h2>
            <p className="mt-4 text-sm text-muted">
              Fill in your details below and we&apos;ll send the full Khena catalogue straight to
              your download.
            </p>
            <div className="mt-8">
              <CatalogueLeadForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
