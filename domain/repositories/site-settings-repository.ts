import type {SiteSettings} from "@/domain/entities/site-settings";

export interface SiteSettingsRepository {
  get(): Promise<SiteSettings>;
}
