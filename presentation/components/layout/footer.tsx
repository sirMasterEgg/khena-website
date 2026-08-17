import Link from "next/link";
import {Container} from "@/presentation/components/ui/container";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {NewsletterForm} from "@/presentation/components/layout/newsletter-form";
import {clientEnv} from "@/config/env.client";

const CUSTOMER_SERVICE_LINKS = [
  {label: "Contact", href: "/contact"},
  {label: "FAQ", href: "/info/faq"},
  {label: "Shipping", href: "/info/shipping"},
  {label: "Returns", href: "/info/returns"},
];

const INFORMATION_LINKS = [
  {label: "About Us", href: "/about"},
  {label: "Career", href: "/info/career"},
  {label: "Care and Maintenance", href: "/info/care"},
  {label: "Assembly Manuals", href: "/info/assembly"},
];

const PROFESSIONALS_LINKS = [
  {label: "Showrooms", href: "/showroom"},
  {label: "Catalogues", href: "/info/catalogue"},
  {label: "Contract Projects", href: "/info/contract"},
  // Tidak ada halaman khusus untuk ini di bagian 2.1 issue.md — diarahkan ke
  // /about sebagai padanan terdekat.
  {label: "Company information", href: "/about"},
];

const LEGAL_LINKS = [
  {label: "Terms", href: "/info/terms"},
  {label: "Privacy", href: "/info/privacy"},
];

const WHATSAPP_NUMBER = clientEnv.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER ?? "62XXXXXXXXXX";

/** Footer 4 kolom — bagian 3.2 issue.md. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink pt-15">
      <Container>
        <div className="grid grid-cols-1 gap-15 pb-15 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-display text-3xl">An Invitation to Khena</h2>
            <p className="mt-4 text-sm text-muted">
              Join our list and receive 10% off your first order, plus early access to new pieces.
            </p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-muted">
              By subscribing you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>

          <FooterColumn title="Customer Service" links={CUSTOMER_SERVICE_LINKS} />
          <FooterColumn title="Information" links={INFORMATION_LINKS} />
          <FooterColumn title="Professionals" links={PROFESSIONALS_LINKS} />
        </div>

        <div className="flex flex-col gap-4 border-t border-hairline py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ink">
                {link.label}
              </Link>
            ))}
            <span>© {year} Khena. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/khena.living"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Khena on Instagram"
            >
              <Icon icon={ICONS.instagram} className="size-4.5" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Khena on WhatsApp"
            >
              <Icon icon={ICONS.whatsapp} className="size-4.5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({title, links}: {title: string; links: {label: string; href: string}[]}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-label text-muted">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm transition-colors duration-300 ease-brand hover:text-accent">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
