import type {SiteSettings} from "@/domain/entities/site-settings";
import {siteSettingsRepository} from "@/infrastructure/repositories";

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettingsRepository.get();
}
