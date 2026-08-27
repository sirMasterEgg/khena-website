"use client";

import {useMemo, useState} from "react";
import {Chip} from "@/presentation/components/ui/chip";
import {Accordion} from "@/presentation/components/ui/accordion";
import {TextLink} from "@/presentation/components/ui/text-link";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {InfoIntro} from "@/presentation/components/info/info-intro";
import {FAQ_HEADER} from "@/presentation/lib/info-fallback";
import type {QaItem} from "@/domain/entities/info-content";

/** Halaman /info/faq — search + tab kategori, bagian 4.9 issue.md + issue #27. */
export function FaqPage({items}: {items: QaItem[]}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");

  const isSearching = query.trim().length > 0;

  // Kategori diturunkan dari data (tidak lagi hardcode): ambil `category`
  // unik yang tidak kosong, urut sesuai kemunculan pertama di data.
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of items) {
      if (item.category && !seen.has(item.category)) {
        seen.add(item.category);
        result.push(item.category);
      }
    }
    return result;
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (isSearching) {
      return items.filter(
        (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
      );
    }
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, query, isSearching, activeCategory]);

  return (
    <>
      <InfoHero eyebrow={FAQ_HEADER.eyebrow} title={FAQ_HEADER.title} />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <InfoIntro>{FAQ_HEADER.intro}</InfoIntro>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions..."
          className="w-full border-0 border-b border-ink bg-transparent py-3 text-base outline-none focus:border-b-2"
        />

        {!isSearching && categories.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-6">
            <Chip active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
              All
            </Chip>
            {categories.map((category) => (
              <Chip
                key={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Chip>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          {items.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted">No questions available yet.</p>
              <div className="mt-4">
                <TextLink href="/contact">CONTACT US</TextLink>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted">No results for &ldquo;{query}&rdquo;</p>
              <div className="mt-4">
                <TextLink href="/contact">CONTACT US</TextLink>
              </div>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Accordion key={item.id} title={item.question}>
                {item.answer}
              </Accordion>
            ))
          )}
        </div>
      </div>
    </>
  );
}
