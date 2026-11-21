import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { ServiceCardSkeleton } from "@/components/services/ServiceCard";
import { Categories } from "@/components/home/Categories";
import { WhyChoose } from "@/components/home/WhyChoose";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { CtaBand } from "@/components/home/CtaBand";

export const dynamic = "force-dynamic";

function FeaturedFallback() {
  return (
    <section className="container-page py-20">
      <div className="mb-10 h-24" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<FeaturedFallback />}>
        <FeaturedServices />
      </Suspense>
      <Categories />
      <WhyChoose />
      <HowItWorks />
      <Testimonials />
      <CtaBand />
    </>
  );
}
