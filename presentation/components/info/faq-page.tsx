"use client";

import {useMemo, useState} from "react";
import {Chip} from "@/presentation/components/ui/chip";
import {Accordion} from "@/presentation/components/ui/accordion";
import {TextLink} from "@/presentation/components/ui/text-link";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {InfoIntro} from "@/presentation/components/info/info-intro";
import {FAQ_CATEGORIES, FAQ_ITEMS, type FaqCategoryId} from "@/infrastructure/mock/data/info-pages";

/** Halaman /info/faq — search + tab kategori, bagian 4.9 issue.md. */
export function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId | "all">("all");

  const isSearching = query.trim().length > 0;

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (isSearching) {
      return FAQ_ITEMS.filter(
        (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
      );
    }
    if (activeCategory === "all") return FAQ_ITEMS;
    return FAQ_ITEMS.filter((item) => item.category === activeCategory);
  }, [query, isSearching, activeCategory]);

  return (
    <>
      <InfoHero eyebrow="Customer Service" title="Frequently Asked Questions" />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <InfoIntro>
          Answers to the questions we hear most often — search below or browse by topic.
        </InfoIntro>

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions..."
          className="w-full border-0 border-b border-ink bg-transparent py-3 text-base outline-none focus:border-b-2"
        />

        {!isSearching ? (
          <div className="mt-6 flex flex-wrap gap-6">
            <Chip active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
              All
            </Chip>
            {FAQ_CATEGORIES.map((category) => (
              <Chip
                key={category.id}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Chip>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          {filteredItems.length === 0 ? (
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
