import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Features from "@/components/home/Features";
import Stats from "@/components/home/Stats";
import ProgramHighlights from "@/components/home/ProgramHighlights";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ testimonial?: string }>;
}) {
  const { testimonial } = await searchParams;
  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <Stats />
      <ProgramHighlights />
      <Testimonials openSubmit={testimonial === "1"} />
      <CTASection />
    </>
  );
}
