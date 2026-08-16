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
import {useToast} from "@/presentation/providers/toast-provider";
import {contactSubmissionService} from "@/infrastructure/services";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const contactFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone number is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Form kontak — bagian 4.8 issue.md. */
export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<ContactFormValues>({resolver: zodResolver(contactFormSchema)});
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const {toast} = useToast();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setFileError("File must be 10 MB or smaller");
      event.target.value = "";
      return;
    }

    setFileError(undefined);
    setFile(selected);
  }

  async function onSubmit(values: ContactFormValues) {
    await contactSubmissionService.submit({...values, attachmentName: file?.name});
    toast("Your message has been sent.");
    reset();
    setFile(null);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Full Name" {...register("fullName")} error={errors.fullName?.message} />
        <FormField
          label="Email Address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Phone Number"
          type="tel"
          {...register("phone")}
          error={errors.phone?.message}
        />
        <FormField label="Subject" {...register("subject")} error={errors.subject?.message} />
      </div>

      <FormField
        as="textarea"
        label="Your Message"
        rows={5}
        {...register("message")}
        error={errors.message?.message}
      />

      <div>
        <p className="mb-2 block text-xs uppercase tracking-label text-muted">Attachment</p>
        {file ? (
          <div className="flex items-center gap-3 text-sm">
            <span>{file.name}</span>
            <button
              type="button"
              aria-label="Remove attachment"
              onClick={() => setFile(null)}
              className="text-muted hover:text-ink"
            >
              <Icon icon={ICONS.close} className="size-3.5" />
            </button>
          </div>
        ) : (
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-label underline underline-offset-4">
            <Icon icon={ICONS.fileUpload} className="size-3.5" />
            Attach File
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
        <p className={`mt-1 text-xs ${fileError ? "text-danger" : "text-muted"}`}>
          {fileError ?? "Optional — image, PDF, max 10 MB"}
        </p>
      </div>

      <Button type="submit" variant="dark" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
