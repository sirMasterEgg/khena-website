import {RemoteImage} from "@/presentation/components/ui/remote-image";
import {TextLink} from "@/presentation/components/ui/text-link";
import {Container} from "@/presentation/components/ui/container";
import type {HeroContent} from "@/domain/entities/landing-content";

/**
 * Product Hero banner — bagian 4.1 issue.md, konten dari CMS (issue #27).
 * Bentuk `content` identik dengan `mainHero`.
 */
export function ProductHeroBanner({content}: {content: HeroContent}) {
  return (
    <Container className="pt-30">
      <div className="relative flex h-154.5 items-center justify-center overflow-hidden">
        <RemoteImage
          src={content.image.url}
          alt={content.image.alt}
          className="absolute inset-0"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative z-10 max-w-190 px-6 text-center text-invert">
          <p className="text-eyebrow uppercase tracking-eyebrow">{content.eyebrow}</p>
          <h2 className="mt-4 font-display text-h2">{content.headline}</h2>
          <div className="mt-6">
            <TextLink href={content.ctaHref} className="text-invert">
              {content.ctaLabel}
            </TextLink>
          </div>
        </div>
      </div>
    </Container>
  );
}
