"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceCard, ServiceCardSkeleton } from "@/components/services/ServiceCard";
import { EmptyState, ErrorState } from "@/components/dashboard/widgets";
import { useApi } from "@/hooks/useApi";
import { CATEGORIES } from "@/lib/constants";
import type { PageMeta, Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "featured", label: "Featured & newest" },
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

type Meta = PageMeta & { totalPublic: number };

export function BrowseServices() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "all";
  const location = params.get("location") ?? "";
  const sort = params.get("sort") ?? "featured";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(search);
  const [locationInput, setLocationInput] = useState(location);
  useEffect(() => setSearchInput(search), [search]);
  useEffect(() => setLocationInput(location), [location]);

  const setParams = (patch: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (!v || v === "all" || (k === "sort" && v === "featured")) next.delete(k);
      else next.set(k, v);
    }
    if (resetPage) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // debounce free-text inputs into the URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput.trim() !== search) setParams({ search: searchInput.trim() || null });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);
  useEffect(() => {
    const t = setTimeout(() => {
      if (locationInput.trim() !== location) setParams({ location: locationInput.trim() || null });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationInput]);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (category !== "all") q.set("category", category);
    if (location) q.set("location", location);
    q.set("sort", sort);
    q.set("page", String(page));
    q.set("limit", "12");
    return q.toString();
  }, [search, category, location, sort, page]);

  const { data, meta, loading, error, reload } = useApi<Service[], Meta>(`/api/services?${query}`, { auth: false });
  const { data: locations } = useApi<string[]>("/api/services/locations", { auth: false });

  const hasFilters = Boolean(search || category !== "all" || location);
  const clearAll = () => {
    setSearchInput("");
    setLocationInput("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <>
      <div className="sticky top-16 z-20 -mx-4 border-b bg-background/90 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-4 sm:shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search services, vendors, styles…"
              className="h-11 pl-9"
              aria-label="Search services"
            />
          </div>
          <Select value={category} onValueChange={(v) => setParams({ category: v })}>
            <SelectTrigger className="h-11 w-full" aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Any location"
              list="wp-locations"
              className="h-11 pl-9"
              aria-label="Filter by location"
            />
            <datalist id="wp-locations">
              {locations?.map((l) => <option key={l} value={l} />)}
            </datalist>
          </div>
          <Select value={sort} onValueChange={(v) => setParams({ sort: v })}>
            <SelectTrigger className="h-11 w-full" aria-label="Sort services">
              <SlidersHorizontal className="size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasFilters ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {search ? <Chip label={`“${search}”`} onClear={() => { setSearchInput(""); setParams({ search: null }); }} /> : null}
            {category !== "all" ? <Chip label={CATEGORIES.find((c) => c.value === category)?.short ?? category} onClear={() => setParams({ category: null })} /> : null}
            {location ? <Chip label={location} onClear={() => { setLocationInput(""); setParams({ location: null }); }} /> : null}
            <button onClick={clearAll} className="text-sm font-medium text-primary hover:underline">Clear all</button>
          </div>
        ) : null}
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {loading ? "Loading services…" : meta ? <>Showing <b className="text-foreground">{data?.length ?? 0}</b> of <b className="text-foreground">{meta.total}</b> matching services ({meta.totalPublic} approved in total)</> : null}
      </p>

      <div className="mt-4">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => reload()} />
        ) : !data?.length ? (
          <EmptyState
            icon={SearchX}
            title="No services match your search"
            description={hasFilters ? "Try a different keyword, another category or a nearby city." : "No services have been approved yet — please check back soon."}
            action={hasFilters ? <Button onClick={clearAll} variant="outline">Clear filters</Button> : null}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((s, i) => <ServiceCard key={s._id} service={s} priority={i < 4} />)}
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && !loading ? (
        <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Pagination">
          <Button variant="outline" disabled={page <= 1} onClick={() => setParams({ page: String(page - 1) }, false)}>Previous</Button>
          {Array.from({ length: meta.totalPages }).slice(0, 7).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "ghost"}
              size="icon"
              onClick={() => setParams({ page: String(i + 1) }, false)}
              aria-current={page === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" disabled={page >= meta.totalPages} onClick={() => setParams({ page: String(page + 1) }, false)}>Next</Button>
        </nav>
      ) : null}
    </>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground")}>
      {label}
      <button onClick={onClear} aria-label={`Remove ${label}`} className="rounded-full p-0.5 hover:bg-background/60">
        <X className="size-3" />
      </button>
    </span>
  );
}
