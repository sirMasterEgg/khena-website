"use client";

import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {InfoIntro} from "@/presentation/components/info/info-intro";
import {CareerApplicationForm} from "@/presentation/components/info/career-application-form";
import {cn} from "@/presentation/lib/cn";
import {careerDetailRepository} from "@/infrastructure/repositories/client";
import type {CareerSummary} from "@/domain/entities/career";

export type CareerPageProps = {
  careers: CareerSummary[];
  /** `true` bila `GET /api/careers` gagal — dibedakan dari daftar kosong (D8). */
  failed?: boolean;
};

/** Baris subtitle satu lowongan, buang bagian kosong supaya tidak ada "·" dobel. */
function careerSubtitle(career: CareerSummary): string {
  return [career.department, career.location, career.employmentType].filter(Boolean).join(" · ");
}

/** Halaman /info/career — daftar lowongan dari API + panel detail (issue #36). */
export function CareerPage({careers, failed = false}: CareerPageProps) {
  const [selected, setSelected] = useState<CareerSummary | null>(null);

  /** Klik lowongan yang sedang terbuka menutupnya kembali (toggle). */
  function handleSelect(career: CareerSummary) {
    setSelected((current) => (current?.id === career.id ? null : career));
  }

  const detail = useQuery({
    queryKey: ["career-detail", selected?.slug],
    // `enabled` menjaga query tidak jalan sebelum ada lowongan dipilih.
    enabled: selected !== null,
    queryFn: ({signal}) => careerDetailRepository.getByIdOrSlug(selected!.slug, signal),
  });

  return (
    <>
      <InfoHero eyebrow="Information" title="Career" />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <InfoIntro>
          Join a small team that cares deeply about craft, material, and quiet design.
        </InfoIntro>

        {failed ? (
          <p className="mb-14 text-sm text-muted">
            Open positions are unavailable right now. Please try again shortly.
          </p>
        ) : careers.length > 0 ? (
          <div className="mb-14 border-t border-hairline">
            {careers.map((career) => {
              const isOpen = selected?.id === career.id;
              return (
                <div key={career.id} className="border-b border-hairline">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => handleSelect(career)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-300 ease-brand",
                      isOpen && "text-accent"
                    )}
                  >
                    <span>
                      <span className="block text-sm">{career.positionTitle}</span>
                      <span className="block text-xs text-muted">{careerSubtitle(career)}</span>
                    </span>
                    <span className="text-xs uppercase tracking-label">{isOpen ? "Close" : "View"}</span>
                  </button>

                  {isOpen && (
                    <div className="pb-6 text-sm">
                      {detail.isPending ? (
                        <p className="text-muted">Loading details…</p>
                      ) : detail.isError ? (
                        <p className="text-muted">Couldn&apos;t load this position. Please try again.</p>
                      ) : detail.data ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs uppercase tracking-label text-muted">Role</p>
                            <p className="mt-1 whitespace-pre-line">{detail.data.roleDescription}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-label text-muted">Requirements</p>
                            <p className="mt-1 whitespace-pre-line">{detail.data.requirements}</p>
                          </div>
                          {detail.data.benefits && (
                            <div>
                              <p className="text-xs uppercase tracking-label text-muted">Benefits</p>
                              <p className="mt-1 whitespace-pre-line">{detail.data.benefits}</p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mb-14 text-sm text-muted">
            There are no open positions right now — check back soon.
          </p>
        )}

        <CareerApplicationForm job={selected} />
      </div>
    </>
  );
}
