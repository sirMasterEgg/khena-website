import type {LandingContent} from "@/domain/entities/landing-content";
import {landingContentRepository} from "@/infrastructure/repositories";

export async function getLandingContent(): Promise<LandingContent> {
  return landingContentRepository.get();
}
