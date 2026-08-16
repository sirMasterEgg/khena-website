import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {TextLink} from "@/presentation/components/ui/text-link";
import {Container} from "@/presentation/components/ui/container";

/** Product Hero banner — bagian 4.1 issue.md. */
export function ProductHeroBanner() {
  return (
    <Container className="pt-30">
      <div className="relative flex h-154.5 items-center justify-center overflow-hidden">
        <PlaceholderImage className="absolute inset-0" />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative z-10 max-w-190 px-6 text-center text-invert">
          <p className="text-eyebrow uppercase tracking-eyebrow">
            Premium Panels · Refined Finishes · Wood Accents
          </p>
          <h2 className="mt-4 font-display text-h2">Every Piece</h2>
          <div className="mt-6">
            <TextLink href="/shop" className="text-invert">
              EXPLORE THE RANGE
            </TextLink>
          </div>
        </div>
      </div>
    </Container>
  );
}
