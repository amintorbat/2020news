import Link from "next/link";

const footerLinks = [
  { label: "درباره ۲۰۲۰نیوز", href: "/about" },
  { label: "ارتباط با ما", href: "/contact" },
  { label: "تبلیغات", href: "/ads" },
  { label: "حریم خصوصی", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-default bg-background/90">
      <div className="container flex flex-col gap-3 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-right">
          <p>
            © {new Date().getFullYear()} ۲۰۲۰نیوز — مرجع اخبار فوتسال و فوتبال
            ساحلی ایران
          </p>
          <p className="text-xs">
            طراحی و توسعه توسط{" "}
            <Link
              href="https://www.torbatesfahaniagency.ir/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              TeaBusiness – Torbat Esfahani Agency
            </Link>
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-4 text-xs">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
