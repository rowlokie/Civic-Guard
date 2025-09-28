import HeroSection from "@/components/HeroSection";
import GamificationShowcase from "@/components/GamificationShowcase";
import MissionBoard from "@/components/MissionBoard";
import HowItWorks from "@/components/HowItWorks";
import ImpactStats from "@/components/ImpactStats";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ImpactStats />
      <GamificationShowcase />
      <MissionBoard />
      <HowItWorks />
    </div>
  );
};

export default Index;