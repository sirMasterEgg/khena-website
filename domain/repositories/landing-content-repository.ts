import type {LandingContent} from "@/domain/entities/landing-content";

export interface LandingContentRepository {
  get(): Promise<LandingContent>;
}
