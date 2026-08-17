"use client";

import {useState} from "react";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {FormField} from "@/presentation/components/ui/form-field";
import {Button} from "@/presentation/components/ui/button";
import {leadService} from "@/infrastructure/services";
import {CATALOGUE_INDUSTRIES} from "@/infrastructure/mock/data/info-pages";

const DOWNLOAD_DELAY_MS = 700;
// Belum ada aset PDF sungguhan — placeholder path (bagian 0.3.5 issue.md).
const CATALOGUE_FILE_URL = "/downloads/khena-catalogue.pdf";

const leadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().optional(),
  country: z.string().trim().min(1, "Country is required"),
  industry: z.string().trim().min(1, "Industry is required"),
  marketingConsent: z.boolean().optional(),
  privacyConsent: z.boolean().refine((value) => value === true, {
    message: "Please accept the privacy policy to continue",
  }),
});

type LeadFormValues = z.infer<typeof leadSchema>;

/** Form gate download katalog — bagian 4.9 issue.md. */
export function CatalogueLeadForm() {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LeadFormValues>({resolver: zodResolver(leadSchema)});
  const [status, setStatus] = useState<"idle" | "success">("idle");

  async function onSubmit(values: LeadFormValues) {
    await leadService.submit({
      sourceType: "catalogue",
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      country: values.country,
      industry: values.industry,
      marketingConsent: values.marketingConsent ?? false,
    });
    setStatus("success");
    setTimeout(() => {
      window.location.assign(CATALOGUE_FILE_URL);
    }, DOWNLOAD_DELAY_MS);
  }

  if (status === "success") {
    return (
      <div className="border border-hairline p-8 text-center">
        <p className="font-display text-h3">Thank You</p>
        <p className="mt-2 text-sm text-muted">Your download will start automatically in a moment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="First Name" {...register("firstName")} error={errors.firstName?.message} />
        <FormField label="Last Name" {...register("lastName")} error={errors.lastName?.message} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <FormField label="Phone" type="tel" hint="Optional" {...register("phone")} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField label="Country" {...register("country")} error={errors.country?.message} />
        <FormField
          as="select"
          label="Industry"
          placeholder="Select one"
          options={CATALOGUE_INDUSTRIES.map((industry) => ({value: industry, label: industry}))}
          {...register("industry")}
          error={errors.industry?.message}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" className="mt-1" {...register("marketingConsent")} />
        Keep me updated on new collections and offers.
      </label>

      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" className="mt-1" {...register("privacyConsent")} />
          <span>
            I agree to the{" "}
            <Link href="/info/privacy" className="underline">
              Privacy Policy
            </Link>
            .*
          </span>
        </label>
        {errors.privacyConsent ? (
          <p className="mt-1 text-xs text-danger">{errors.privacyConsent.message}</p>
        ) : null}
      </div>

      <Button type="submit" variant="dark" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Download Catalogue"}
      </Button>
    </form>
  );
}
