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
import {careerApplicationService} from "@/infrastructure/services/client";
import {ApiError} from "@/infrastructure/api/client";
import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  MAX_ATTACHMENT_BYTES,
} from "@/domain/services/career-application-service";
import type {CareerSummary} from "@/domain/entities/career";

const applicationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone number is required"),
  coverNote: z.string().optional(),
});

type ApplicationValues = z.infer<typeof applicationSchema>;

export type CareerApplicationFormProps = {
  job: CareerSummary | null;
};

function fileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot).toLowerCase();
}

function formatMaxSize(): string {
  return `${Math.round(MAX_ATTACHMENT_BYTES / (1024 * 1024))} MB`;
}

/** Form lamaran kontekstual — judul berubah sesuai lowongan terpilih (issue #36). */
export function CareerApplicationForm({job}: CareerApplicationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<ApplicationValues>({resolver: zodResolver(applicationSchema)});
  const [resume, setResume] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setAttachmentError(null);

    if (!file) {
      setResume(null);
      return;
    }

    if (file.size > MAX_ATTACHMENT_BYTES) {
      setAttachmentError(`"${file.name}" exceeds the maximum size of ${formatMaxSize()}.`);
      event.target.value = "";
      return;
    }

    if (!(ALLOWED_ATTACHMENT_EXTENSIONS as readonly string[]).includes(fileExtension(file.name))) {
      setAttachmentError(`"${file.name}" is not a supported file type.`);
      event.target.value = "";
      return;
    }

    setResume(file);
  }

  async function onSubmit(values: ApplicationValues) {
    setSubmitError(null);
    try {
      await careerApplicationService.submit({
        jobId: job?.id, // undefined = lamaran spontan (D7)
        name: values.fullName, // API memakai `name`, bukan `fullName`
        email: values.email,
        phone: values.phone,
        message: values.coverNote, // API memakai `message`, bukan `coverNote`
        attachment: resume ?? undefined,
      });
      setSent(true);
      reset();
      setResume(null);
    } catch (error) {
      // ApiError dari apiClient sudah membawa pesan backend (`error.message` pada
      // envelope), mis. "job not found" saat lowongan keburu ditutup.
      setSubmitError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again."
      );
    }
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
        {job ? `Applying for: ${job.positionTitle}` : "Send us a spontaneous application"}
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
                accept={ALLOWED_ATTACHMENT_EXTENSIONS.join(",")}
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
          {attachmentError ? <p className="mt-1 text-xs text-danger">{attachmentError}</p> : null}
        </div>

        {submitError ? <p className="text-xs text-danger">{submitError}</p> : null}

        <Button type="submit" variant="dark" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send Application"}
        </Button>
      </form>
    </div>
  );
}
