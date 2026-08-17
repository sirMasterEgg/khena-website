"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useToast} from "@/presentation/providers/toast-provider";

const newsletterSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

/**
 * Form email newsletter footer — bagian 3.2 issue.md. Belum tersambung ke
 * `POST /newsletter-subscribers` (ISSUE-15), untuk sekarang cukup toast.
 */
export function NewsletterForm() {
  const {toast} = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<NewsletterValues>({resolver: zodResolver(newsletterSchema)});

  function onSubmit() {
    toast("Thanks for subscribing to Khena.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6">
      <div className="flex items-end gap-2 border-b border-ink pb-2">
        <input
          type="email"
          placeholder="Your email address"
          aria-label="Email address"
          className="w-full border-0 bg-transparent py-2 text-sm outline-none placeholder:text-faint"
          {...register("email")}
        />
        <button type="submit" disabled={isSubmitting} className="shrink-0 text-xs uppercase tracking-button py-2">
          Subscribe
        </button>
      </div>
      {errors.email ? <p className="mt-1 text-xs text-danger">{errors.email.message}</p> : null}
    </form>
  );
}
