"use client";

import {useState} from "react";
import type {ChangeEvent} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {FormField} from "@/presentation/components/ui/form-field";
import {Button} from "@/presentation/components/ui/button";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {jobApplicationService} from "@/infrastructure/services";
import type {Job} from "@/domain/entities/job";

const applicationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone number is required"),
  coverNote: z.string().optional(),
});

type ApplicationValues = z.infer<typeof applicationSchema>;

export type CareerApplicationFormProps = {
  job: Job | null;
};

/** Form lamaran kontekstual — judul berubah sesuai job terpilih (bagian 4.9 issue.md). */
export function CareerApplicationForm({job}: CareerApplicationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<ApplicationValues>({resolver: zodResolver(applicationSchema)});
  const [resume, setResume] = useState<File | null>(null);
  const [sent, setSent] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setResume(event.target.files?.[0] ?? null);
  }

  async function onSubmit(values: ApplicationValues) {
    await jobApplicationService.submit({
      jobId: job?.id,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      coverNote: values.coverNote,
      resumeFileName: resume?.name,
    });
    setSent(true);
    reset();
    setResume(null);
  }

  if (sent) {
    return (
      <div className="border border-hairline p-8 text-center">
        <p className="font-display text-h3">Thank You</p>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve received your application and will be in touch if there&apos;s a match.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-h3">
        {job ? `Applying for: ${job.title}` : "Send us a spontaneous application"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField label="Full Name" {...register("fullName")} error={errors.fullName?.message} />
          <FormField
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
        <FormField label="Phone Number" type="tel" {...register("phone")} error={errors.phone?.message} />
        <FormField as="textarea" label="Note (optional)" rows={4} {...register("coverNote")} />

        <div>
          <p className="mb-2 block text-xs uppercase tracking-label text-muted">Resume / CV</p>
          {resume ? (
            <div className="flex items-center gap-3 text-sm">
              <span>{resume.name}</span>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => setResume(null)}
                className="text-muted hover:text-ink"
              >
                <Icon icon={ICONS.close} className="size-3.5" />
              </button>
            </div>
          ) : (
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-label underline underline-offset-4">
              <Icon icon={ICONS.fileUpload} className="size-3.5" />
              Attach CV
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        <Button type="submit" variant="dark" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send Application"}
        </Button>
      </form>
    </div>
  );
}
