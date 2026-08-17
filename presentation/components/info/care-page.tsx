"use client";

import {useState} from "react";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {InfoIntro} from "@/presentation/components/info/info-intro";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {cn} from "@/presentation/lib/cn";
import {CARE_MATERIALS} from "@/infrastructure/mock/data/info-pages";

/**
 * Halaman /info/care — accordion custom (bukan `<details>`) karena hanya
 * satu boleh terbuka pada satu waktu, bagian 4.9 issue.md.
 */
export function CarePage() {
  const [openId, setOpenId] = useState<string | null>(CARE_MATERIALS[0]?.id ?? null);

  return (
    <>
      <InfoHero eyebrow="Information" title="Care & Maintenance" />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <InfoIntro>
          Simple care routines to keep every material looking its best for years to come.
        </InfoIntro>

        <div>
          {CARE_MATERIALS.map((material) => {
            const open = openId === material.id;
            return (
              <div key={material.id} className="border-b border-hairline">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : material.id)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm uppercase tracking-label"
                >
                  {material.label}
                  <Icon
                    icon={ICONS.chevronRight}
                    className={cn(
                      "size-3.5 shrink-0 transition-transform duration-300 ease-brand",
                      open && "rotate-90"
                    )}
                  />
                </button>
                {/* Trik `grid-template-rows: 0fr -> 1fr` supaya buka/tutup
                    bertransisi ke tinggi konten sebenarnya, bukan instan
                    seperti render kondisional biasa. */}
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-brand",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div aria-hidden={!open} className="pb-5 text-sm text-muted">
                      <p>{material.intro}</p>
                      <ul className="mt-3 list-disc space-y-1 pl-4">
                        {material.tips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
