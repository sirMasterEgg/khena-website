import type {Metadata} from "next";
import {Container} from "@/presentation/components/ui/container";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {TextLink} from "@/presentation/components/ui/text-link";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {RevealStagger} from "@/presentation/components/motion/reveal-stagger";

export const metadata: Metadata = {
  title: "About Us",
  description: "The Khena story — designed for quiet living.",
};

const VALUES = [
  {
    icon: ICONS.swatchbook,
    title: "Refined Texture",
    body: "Surfaces chosen for how they feel, not just how they photograph.",
  },
  {
    icon: ICONS.compass,
    title: "Timeless Living",
    body: "Pieces designed to outlast seasons, trends, and quick replacements.",
  },
  {
    icon: ICONS.pencil,
    title: "Enduring Quality",
    body: "Built with joinery and materials made to be passed down.",
  },
];

/** Halaman naratif /about — bagian 4.7 issue.md. */
export default function AboutPage() {
  return (
    <>
      <div className="relative flex h-128.5 items-center justify-center overflow-hidden text-center text-invert">
        <PlaceholderImage className="absolute inset-0 brightness-60" />
        <div className="relative z-10 px-6">
          <p className="text-eyebrow uppercase tracking-eyebrow">Our Story</p>
          <h1 className="mt-4 font-display text-h1">The Khena Story</h1>
        </div>
      </div>

      <Container className="py-20 text-center lg:py-30">
        <div className="mx-auto max-w-225">
          <h2 className="font-display text-h2">Designed for Quiet Living</h2>
          <p className="mt-6 text-body-lg text-muted">
            Khena began with a simple belief: furniture should recede into daily life, not compete
            with it. Every piece is designed to feel inevitable in a room, built from materials that
            grow more beautiful with time.
          </p>
        </div>
      </Container>

      <Container>
        <div className="aspect-[1420/468]">
          <PlaceholderImage label="Khena workshop" />
        </div>
      </Container>

      <Container className="py-20 text-center lg:py-30">
        <div className="mx-auto max-w-225">
          <h2 className="font-display text-h2">Our Philosophy</h2>
          <p className="mt-6 text-body-lg text-muted">
            We work with a small circle of craftspeople who share our patience for doing things
            properly — solid joinery over shortcuts, natural finishes over lacquer, pieces made to
            be repaired rather than replaced.
          </p>
        </div>

        <RevealStagger
          className="mt-20 grid grid-cols-1 gap-15 sm:grid-cols-3"
          itemClassName="flex flex-col items-center"
        >
          {VALUES.map((value) => (
            <div key={value.title} className="flex flex-col items-center">
              <span className="flex size-17 items-center justify-center rounded-full border border-hairline">
                <Icon icon={value.icon} className="size-6 text-muted" />
              </span>
              <h3 className="mt-6 text-xl">{value.title}</h3>
              <p className="mt-2 text-base text-muted">{value.body}</p>
            </div>
          ))}
        </RevealStagger>
      </Container>

      <div className="bg-warm py-20 lg:py-30">
        <Container>
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-eyebrow uppercase tracking-eyebrow text-muted">Our Craft</p>
              <h2 className="mt-4 font-display text-h2">Crafted with Quiet Precision</h2>
              <p className="mt-6 text-base text-muted">
                From kiln to finish, every piece passes through hands that know the material —
                sanded, oiled, and inspected by the same craftspeople who shaped it.
              </p>
            </div>
            <div className="aspect-[820/468]">
              <PlaceholderImage label="Khena craftsmanship" />
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-20 text-center lg:py-30">
        <div className="mx-auto max-w-225">
          <h2 className="font-display text-h2">For Homes, For Life</h2>
          <p className="mt-6 text-body-lg text-muted">
            Whether it&apos;s your first home or your forever one, Khena pieces are built to move
            with you — quietly, dependably, for years to come.
          </p>
          <div className="mt-6">
            <TextLink href="/shop">DISCOVER KHENA</TextLink>
          </div>
        </div>
      </Container>

      <Container className="pb-20 lg:pb-30">
        <div className="aspect-[1420/468]">
          <PlaceholderImage label="Khena showroom detail" />
        </div>
      </Container>
    </>
  );
}
