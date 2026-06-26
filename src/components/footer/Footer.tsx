import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Fleet Support", href: "/support" },
  { label: "Contact Lab", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-surface-container-high">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter px-gutter py-16">
        {/* Brand column */}
        <div className="md:col-span-2">
          <h3 className="text-primary font-heading text-xl font-semibold tracking-tight">
            Tattva Tech
          </h3>
          <p className="text-on-surface-variant text-sm mt-3 leading-relaxed max-w-xs">
            &copy; 2026 Tattva Tech Innovation Lab. Engineering the Future of
            Flight.
          </p>
        </div>

        {/* Links column */}
        <div className="md:col-span-2">
          <nav className="flex flex-col gap-3 md:items-end">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
