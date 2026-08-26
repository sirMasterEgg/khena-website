"use client";

import {useState} from "react";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {InfoIntro} from "@/presentation/components/info/info-intro";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {cn} from "@/presentation/lib/cn";
import {CARE_HEADER} from "@/presentation/lib/info-fallback";
import type {QaItem} from "@/domain/entities/info-content";

/**
 * Halaman /info/care — accordion custom (bukan `<details>`) karena hanya
 * satu boleh terbuka pada satu waktu, bagian 4.9 issue.md. Konten dari CMS
 * (issue #27): `question` jadi judul, `answer` jadi isi paragraf — tidak ada
 * lagi bullet list `tips` (bentuk CMS tidak menyediakannya).
 */
export function CarePage({items}: {items: QaItem[]}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <>
      <InfoHero eyebrow={CARE_HEADER.eyebrow} title={CARE_HEADER.title} />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <InfoIntro>{CARE_HEADER.intro}</InfoIntro>

        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">No care guidance available yet.</p>
        ) : (
          <div>
            {items.map((item) => {
              const open = openId === item.id;
              return (
                <div key={item.id} className="border-b border-hairline">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm uppercase tracking-label"
                  >
                    {item.question}
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
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
