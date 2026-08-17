import type {Metadata} from "next";
import {Container} from "@/presentation/components/ui/container";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {ContactForm} from "@/presentation/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Khena.",
};

const CONTACT_ROWS = [
  {icon: ICONS.envelope, label: "Email", value: "hello@khena.co.id"},
  {icon: ICONS.phone, label: "Phone", value: "+62 812 3486 7890"},
  {icon: ICONS.clock, label: "Hours", value: "Monday–Friday / 09.00–18.00"},
  {icon: ICONS.mapPin, label: "Location", value: "Jl. Senopati No. 25 / Jakarta Selatan, Indonesia"},
];

/** Halaman /contact — bagian 4.8 issue.md. */
export default function ContactPage() {
  return (
    <>
      <div className="relative flex h-128.5 items-center justify-center overflow-hidden text-center text-invert">
        <PlaceholderImage className="absolute inset-0 brightness-60" />
        <div className="relative z-10 max-w-190 px-6">
          <h1 className="font-display text-h1">We Would Love to Hear from You</h1>
        </div>
      </div>

      <Container className="py-20 lg:py-30">
        <div className="grid grid-cols-1 gap-25 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="font-display text-5xl">Get in Touch</h2>
            <div className="mt-10 space-y-8">
              {CONTACT_ROWS.map((row) => (
                <div key={row.label} className="flex items-start gap-4">
                  <Icon icon={row.icon} className="mt-1 size-5 shrink-0 text-muted" />
                  <div>
                    <p className="text-xs uppercase tracking-label text-muted">{row.label}</p>
                    <p className="mt-1 text-sm">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-5xl">Send Us a Message</h2>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>

      <Container className="pb-20 lg:pb-30">
        <div className="aspect-[1420/468]">
          <PlaceholderImage label="Khena location map" />
        </div>
      </Container>
    </>
  );
}
