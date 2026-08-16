import type {Metadata} from "next";
import {Container} from "@/presentation/components/ui/container";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {Button} from "@/presentation/components/ui/button";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {RevealStagger} from "@/presentation/components/motion/reveal-stagger";

export const metadata: Metadata = {
  title: "Showroom",
  description: "Visit the Khena showroom in Jakarta.",
};

const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Jl.+Senopati+No.+25+Jakarta+Selatan";

const INFO_ROWS = [
  {icon: ICONS.envelope, label: "Email", value: "hello@khena.co.id"},
  {icon: ICONS.phone, label: "Phone", value: "+62 812 3486 7890"},
  {icon: ICONS.clock, label: "Hours", value: "Monday–Friday · 09.00–18.00"},
];

const SERVICES = [
  {icon: ICONS.compass, title: "Experience", body: "Walk through the full collection in person before you commit."},
  {icon: ICONS.swatchbook, title: "Material Library", body: "Touch every finish and fabric available across our pieces."},
  {icon: ICONS.pencil, title: "Design Consultation", body: "One-on-one guidance from our in-house design team."},
  {icon: ICONS.calendarCheck, title: "Private Appointment", body: "Book a quiet slot outside regular showroom hours."},
];

/** Halaman /showroom — bagian 4.6 issue.md. */
export default function ShowroomPage() {
  return (
    <>
      <div className="relative flex h-128.5 items-center overflow-hidden text-invert">
        <PlaceholderImage className="absolute inset-0 brightness-60" />
        <div className="relative z-10 max-w-145 px-6 sm:px-15">
          <p className="text-eyebrow uppercase tracking-eyebrow">Our Showroom — Jakarta</p>
          <h1 className="mt-4 font-display text-h1">Experience Khena in Person</h1>
        </div>
      </div>

      <Container className="py-20 text-center lg:py-30">
        <p className="text-eyebrow uppercase tracking-eyebrow text-muted">More Than a Showroom</p>
        <h2 className="mt-4 font-display text-h2">A Quiet Place to Linger</h2>
        <p className="mt-4 text-body-lg text-muted">Jl. Senopati No. 25, Jakarta Selatan, Indonesia</p>

        <div className="mx-auto mt-15 grid max-w-225 grid-cols-1 gap-15 sm:grid-cols-3">
          {INFO_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col items-center gap-2">
              <Icon icon={row.icon} className="size-5 text-muted" />
              <p className="text-xs uppercase tracking-label text-muted">{row.label}</p>
              <p className="text-sm">{row.value}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <div className="relative aspect-[1420/618]">
          <PlaceholderImage label="Khena showroom interior" />
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <Button variant="dark">Visit on Map</Button>
          </a>
        </div>
      </Container>

      <Container className="py-20 lg:py-30">
        <RevealStagger
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
          itemClassName="text-center"
        >
          {SERVICES.map((service) => (
            <div key={service.title} className="text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-hairline">
                <Icon icon={service.icon} className="size-5 text-muted" />
              </span>
              <h3 className="mt-4 text-lg">{service.title}</h3>
              <p className="mx-auto mt-2 max-w-62.5 text-sm text-muted">{service.body}</p>
            </div>
          ))}
        </RevealStagger>
      </Container>

      <div className="h-195 w-full bg-cover">
        <PlaceholderImage label="Khena showroom full-bleed" />
      </div>

      <Container className="py-20 lg:py-30">
        <div className="grid grid-cols-1 gap-25 lg:grid-cols-2">
          <div className="aspect-[665/365]">
            <PlaceholderImage label="Khena showroom welcome" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-display text-h3">Let&apos;s Welcome You to Khena</h2>
            <p className="mt-4 text-base text-muted">
              Book a private appointment or simply drop by — our team is ready to help you find the
              right pieces for your home.
            </p>
            <div className="mt-6">
              <Button href="/contact" variant="dark" className="min-w-70">
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
