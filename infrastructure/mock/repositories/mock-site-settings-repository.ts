import type {SiteSettings} from "@/domain/entities/site-settings";
import type {SiteSettingsRepository} from "@/domain/repositories/site-settings-repository";
import {MOCK_SITE_SETTINGS} from "@/infrastructure/mock/data/site-settings";

export class MockSiteSettingsRepository implements SiteSettingsRepository {
  async get(): Promise<SiteSettings> {
    return MOCK_SITE_SETTINGS;
  }
}
