import type {NavigationMenu} from "@/domain/entities/navigation";

export interface NavigationRepository {
  get(): Promise<NavigationMenu>;
}
