import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Wrench, Globe, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const NAV_LINK_KEYS = [
  { href: "/", key: "nav.home" },
  { href: "/services", key: "nav.services" },
  { href: "/booking", key: "nav.booking" },
  { href: "/track", key: "nav.track" },
  { href: "/about", key: "nav.about" },
  { href: "/contact", key: "nav.contact" },
];

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { language, setLanguage, t } = useI18n();
  const [cookieAccepted, setCookieAccepted] = useState(() => {
    try { return localStorage.getItem("cookie_ok") === "1"; } catch { return false; }
  });

  const acceptCookie = () => {
    try { localStorage.setItem("cookie_ok", "1"); } catch {}
    setCookieAccepted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <Wrench className="w-5 h-5" />
            EMMI Europe Tech
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINK_KEYS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === l.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {t(l.key)}
              </Link>
            ))}

            {/* Language switcher */}
            <div className="flex items-center gap-1 border border-border rounded-md px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-muted-foreground mr-1" />
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded transition-colors",
                    language === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={lang.flag}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
            {NAV_LINK_KEYS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "block text-sm font-medium py-2 transition-colors hover:text-primary",
                  location === l.href ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                {t(l.key)}
              </Link>
            ))}
            {/* Mobile language switcher */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Globe className="w-4 h-4 text-muted-foreground" />
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setOpen(false); }}
                  className={cn(
                    "text-sm font-medium px-2 py-1 rounded transition-colors",
                    language === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-16">
        <div className="container mx-auto px-4 md:px-8 py-10 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-bold text-primary mb-2 flex items-center gap-2">
                <Wrench className="w-4 h-4" /> EMMI Europe Tech
              </p>
              <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
              <p className="text-xs text-muted-foreground/60 mt-2">{t("footer.legal")}</p>
            </div>
            <div>
              <p className="font-semibold mb-3 text-sm">{t("footer.service_areas")}</p>
              <p className="text-sm text-muted-foreground">{t("footer.location")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("footer.mailin")}</p>
            </div>
            <div>
              <p className="font-semibold mb-3 text-sm">{t("footer.contact")}</p>
              <a href="mailto:contact@emmi-eu.com" className="text-sm text-muted-foreground hover:text-primary block">contact@emmi-eu.com</a>
              <a href="https://wa.me/393792730062" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary block mt-1">WhatsApp +39 379 273 0062</a>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} EMMI Europe Tech — M. TRABELSI. {t("footer.rights")}<br /><span className="opacity-60">{t("footer.copyright_detail")}</span></p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">{t("footer.privacy")}</Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
      </footer>
      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/393792730062"
        target="_blank"
        rel="noreferrer"
        aria-label="Contact via WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* Cookie banner */}
      {!cookieAccepted && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-foreground text-background px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <p className="text-sm text-background/80 max-w-2xl">{t("cookie.message")}</p>
          <button
            onClick={acceptCookie}
            className="shrink-0 bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors rounded-none"
          >
            {t("cookie.accept")}
          </button>
        </div>
      )}
    </div>
  );
}
