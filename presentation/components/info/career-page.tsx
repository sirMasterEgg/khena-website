"use client";

import {useState} from "react";
import {InfoHero} from "@/presentation/components/info/info-hero";
import {InfoIntro} from "@/presentation/components/info/info-intro";
import {CareerApplicationForm} from "@/presentation/components/info/career-application-form";
import {cn} from "@/presentation/lib/cn";
import type {Job} from "@/domain/entities/job";

/** Halaman /info/career — daftar lowongan + form kontekstual (bagian 4.9 issue.md). */
export function CareerPage({jobs}: {jobs: Job[]}) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <>
      <InfoHero eyebrow="Information" title="Career" />

      <div className="mx-auto w-full max-w-215 px-6 py-20 lg:py-30">
        <InfoIntro>
          Join a small team that cares deeply about craft, material, and quiet design.
        </InfoIntro>

        {jobs.length > 0 ? (
          <div className="mb-14 border-t border-hairline">
            {jobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => setSelectedJob(job)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 border-b border-hairline py-5 text-left transition-colors duration-300 ease-brand",
                  selectedJob?.id === job.id && "text-accent"
                )}
              >
                <span>
                  <span className="block text-sm">{job.title}</span>
                  <span className="block text-xs text-muted">
                    {job.department} · {job.location} · {job.type}
                  </span>
                </span>
                <span className="text-xs uppercase tracking-label">View</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mb-14 text-sm text-muted">
            There are no open positions right now — check back soon.
          </p>
        )}

        <CareerApplicationForm job={selectedJob} />
      </div>
    </>
  );
}
