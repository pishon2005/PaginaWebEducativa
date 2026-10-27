import { Hero } from "@/components/public/hero";
import { CoursesSection } from "@/components/public/courses-section";
import { ResearchSection } from "@/components/public/research-section";
import { CommunitySection } from "@/components/public/community-section";

export default function HomePage() {
  return (
    <div className="bg-white text-neutral-900">
      <Hero />

      <CoursesSection />

      <ResearchSection />

      <CommunitySection />
    </div>
  );
}
