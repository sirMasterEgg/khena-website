"use client";

import {useState} from "react";
import {useToast} from "@/presentation/providers/toast-provider";

/**
 * Form email newsletter footer — bagian 3.2 issue.md. Belum tersambung ke
 * `POST /newsletter-subscribers` (ISSUE-15), untuk sekarang cukup toast.
 */
export function NewsletterForm() {
  const {toast} = useToast();
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    toast("Thanks for subscribing to Khena.");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex items-end gap-2 border-b border-ink pb-2">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className="w-full border-0 bg-transparent py-2 text-sm outline-none placeholder:text-faint"
      />
      <button type="submit" className="shrink-0 text-xs uppercase tracking-button">
        Subscribe
      </button>
    </form>
  );
}
