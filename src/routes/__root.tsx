import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Karina Isted. Klinisk psykolog i Solrød Strand" },
      { name: "description", content: "Autoriseret klinisk psykolog. Samtaler til børn, unge og forældre i trygge rammer i Solrød Strand." },
      { name: "author", content: "Karina Isted" },
      { property: "og:title", content: "Karina Isted. Klinisk psykolog i Solrød Strand" },
      { property: "og:description", content: "Autoriseret klinisk psykolog. Samtaler til børn, unge og forældre i trygge rammer i Solrød Strand." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Karina Isted" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Karina Isted. Klinisk psykolog i Solrød Strand" },
      { name: "twitter:description", content: "Autoriseret klinisk psykolog. Samtaler til børn, unge og forældre i trygge rammer i Solrød Strand." },
      { property: "og:image", content: "https://karinaisted.dk/clinic-skylight.jpg" },
      { name: "twitter:image", content: "https://karinaisted.dk/clinic-skylight.jpg" },
      { name: "theme-color", content: "#7FB5D8" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "@id": "https://karinaisted.dk/#business",
          name: "Psykolog Karina Isted",
          description:
            "Autoriseret klinisk psykolog med praksis i Solrød Strand. Samtaler til børn, unge og forældre.",
          url: "https://karinaisted.dk",
          telephone: "+45 42 66 44 29",
          email: "karinaisted@proton.me",
          medicalSpecialty: ["Psychiatric", "Pediatric"],
          priceRange: "1.200–1.500 kr.",
          image: "https://karinaisted.dk/clinic-skylight.jpg",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Solrød Center 70, 1. sal",
            addressLocality: "Solrød Strand",
            postalCode: "2680",
            addressCountry: "DK",
          },
          areaServed: { "@type": "Place", name: "Solrød Strand, Greve, Køge, Sjælland" },
          founder: { "@type": "Person", name: "Karina Isted" },
          knowsLanguage: ["da"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Karina Isted",
          url: "https://karinaisted.dk",
          inLanguage: "da-DK",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="da">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-sand text-ink font-sans flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
