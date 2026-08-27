import {InfoHero} from "@/presentation/components/info/info-hero";
import {InfoIntro} from "@/presentation/components/info/info-intro";
import {CONTRACT_HEADER} from "@/presentation/lib/info-fallback";
import type {ContractProject} from "@/domain/entities/info-content";

/**
 * Halaman /info/contract — grid kartu proyek published dari CMS (issue #27),
 * menggantikan mode `cards` di `static-info-page.tsx`. Proyek `draft` sudah
 * disaring di mapper (`toContractProjects`), jadi `projects` di sini pasti
 * semuanya published.
 */
export function ContractPage({projects}: {projects: ContractProject[]}) {
  return (
    <>
      <InfoHero eyebrow={CONTRACT_HEADER.eyebrow} title={CONTRACT_HEADER.title} />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <InfoIntro>{CONTRACT_HEADER.intro}</InfoIntro>

        {projects.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">No published projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {projects.map((project, index) => (
              <div key={project.id} className="border border-hairline p-8">
                <p className="font-display text-h3 text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 text-lg">{project.field}</h2>
                <p className="mt-2 text-sm text-muted">{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
