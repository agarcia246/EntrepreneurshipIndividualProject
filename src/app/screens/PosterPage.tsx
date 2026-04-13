import { ExternalLink } from "lucide-react";
import { PageHeader } from "../components/shared";

export function PosterPage() {
  const posterUrl = `${import.meta.env.BASE_URL}poster.html`;

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6">
      <PageHeader title="Project Poster" subtitle="Embedded poster preview" back="/app/settings" />

      <div className="bg-card rounded-2xl p-3 shadow-[var(--shadow-card)] border border-border">
        <iframe
          title="FuelFit Project Poster"
          src={posterUrl}
          className="w-full h-[70vh] rounded-xl border border-border bg-white"
        />
      </div>

      <a
        href={posterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-sm text-primary font-semibold"
      >
        Open poster in new tab
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
