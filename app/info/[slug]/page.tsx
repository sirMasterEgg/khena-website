import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getOpenJobs} from "@/application/use-cases/get-open-jobs";
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

const INTERACTIVE_SLUGS = ["faq", "care", "career", "assembly", "catalogue"] as const;
type InteractiveSlug = (typeof INTERACTIVE_SLUGS)[number];

const ALL_SLUGS: string[] = [...STATIC_INFO_SLUGS, ...INTERACTIVE_SLUGS];

function isStaticSlug(slug: string): slug is StaticInfoPageSlug {
  return (STATIC_INFO_SLUGS as string[]).includes(slug);
}

function isInteractiveSlug(slug: string): slug is InteractiveSlug {
  return (INTERACTIVE_SLUGS as readonly string[]).includes(slug);
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

/** Router untuk 10 halaman /info/[slug] — bagian 4.9 issue.md. */
export default async function InfoPage({params}: InfoPageProps) {
  const {slug} = await params;

  if (isStaticSlug(slug)) {
    return <StaticInfoPageView page={STATIC_INFO_PAGES[slug]} />;
  }

  if (!isInteractiveSlug(slug)) {
    notFound();
  }

  switch (slug) {
    case "faq":
      return <FaqPage />;
    case "care":
      return <CarePage />;
    case "career": {
      const jobs = await getOpenJobs();
      return <CareerPage jobs={jobs} />;
    }
    case "assembly":
      return <AssemblyPage />;
    case "catalogue":
      return <CataloguePage />;
  }
}
