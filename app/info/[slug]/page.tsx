import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getOpenCareers} from "@/application/use-cases/get-open-careers";
import {getAssemblyManuals, getContractProjects, getQaItems} from "@/application/use-cases/get-info-content";
import {
  STATIC_INFO_PAGES,
  STATIC_INFO_SLUGS,
  type StaticInfoPageSlug,
} from "@/infrastructure/mock/data/info-pages";
import {StaticInfoPageView} from "@/presentation/components/info/static-info-page";
import {FaqPage} from "@/presentation/components/info/faq-page";
import {CarePage} from "@/presentation/components/info/care-page";
import {CareerPage} from "@/presentation/components/info/career-page";
import {AssemblyPage} from "@/presentation/components/info/assembly-page";
import {CataloguePage} from "@/presentation/components/info/catalogue-page";
import {QaInfoPage} from "@/presentation/components/info/qa-info-page";
import {ContractPage} from "@/presentation/components/info/contract-page";
import {RETURNS_HEADER, SHIPPING_HEADER} from "@/presentation/lib/info-fallback";

/** faq/care/shipping/returns/assembly/contract kini dari CMS (issue #27). */
const DYNAMIC_SLUGS = ["faq", "care", "shipping", "returns", "assembly", "contract"] as const;
type DynamicSlug = (typeof DYNAMIC_SLUGS)[number];

const INTERACTIVE_SLUGS = ["career", "catalogue"] as const;
type InteractiveSlug = (typeof INTERACTIVE_SLUGS)[number];

type NonStaticSlug = DynamicSlug | InteractiveSlug;

const ALL_SLUGS: string[] = [...STATIC_INFO_SLUGS, ...DYNAMIC_SLUGS, ...INTERACTIVE_SLUGS];

// faq/care/shipping/returns/assembly/contract sekarang dinamis (data CMS) —
// revalidate lewat ISR, bukan lagi murni statis. Baca
// 02-guides/incremental-static-regeneration.md sebelum mengubah nilai ini
// (bagian Fase 7 issue #27).
export const revalidate = 300;

function isStaticSlug(slug: string): slug is StaticInfoPageSlug {
  return (STATIC_INFO_SLUGS as string[]).includes(slug);
}

function isDynamicSlug(slug: string): slug is DynamicSlug {
  return (DYNAMIC_SLUGS as readonly string[]).includes(slug);
}

function isInteractiveSlug(slug: string): slug is InteractiveSlug {
  return (INTERACTIVE_SLUGS as readonly string[]).includes(slug);
}

function isNonStaticSlug(slug: string): slug is NonStaticSlug {
  return isDynamicSlug(slug) || isInteractiveSlug(slug);
}

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({slug}));
}

type InfoPageProps = {
  params: Promise<{slug: string}>;
};

export async function generateMetadata({params}: InfoPageProps): Promise<Metadata> {
  const {slug} = await params;
  if (isStaticSlug(slug)) {
    const page = STATIC_INFO_PAGES[slug];
    return {title: page.title, description: page.intro};
  }
  return {};
}

/** Router untuk halaman /info/[slug] — bagian 4.9 issue.md + issue #27. */
export default async function InfoPage({params}: InfoPageProps) {
  const {slug} = await params;

  if (isStaticSlug(slug)) {
    return <StaticInfoPageView page={STATIC_INFO_PAGES[slug]} />;
  }

  if (!isNonStaticSlug(slug)) {
    notFound();
  }

  switch (slug) {
    case "faq": {
      const items = await getQaItems("faq");
      return <FaqPage items={items} />;
    }
    case "care": {
      const items = await getQaItems("care");
      return <CarePage items={items} />;
    }
    case "shipping": {
      const items = await getQaItems("shipping");
      return <QaInfoPage {...SHIPPING_HEADER} items={items} />;
    }
    case "returns": {
      const items = await getQaItems("returns");
      return <QaInfoPage {...RETURNS_HEADER} items={items} />;
    }
    case "assembly": {
      const manuals = await getAssemblyManuals();
      return <AssemblyPage manuals={manuals} />;
    }
    case "contract": {
      const projects = await getContractProjects();
      return <ContractPage projects={projects} />;
    }
    case "career": {
      // Sengaja ditangkap di sini, bukan di use case: halaman yang tahu cara
      // menampilkan kegagalan tanpa mematikan seluruh /info/[slug] (D8).
      // JSX tidak dikonstruksi di dalam try/catch (aturan react-hooks/error-boundaries)
      // — sama seperti pola /collections & /shop.
      let careers: Awaited<ReturnType<typeof getOpenCareers>>["items"] | null = null;
      try {
        careers = (await getOpenCareers()).items;
      } catch (error) {
        console.error("[career] gagal memuat lowongan", error);
      }
      return <CareerPage careers={careers ?? []} failed={careers === null} />;
    }
    case "catalogue":
      return <CataloguePage />;
    default:
      notFound();
  }
}
