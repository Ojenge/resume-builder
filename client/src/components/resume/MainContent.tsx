import SummarySection from "./SummarySection";
import ExperienceSection from "./ExperienceSection";
import AchievementsSection from "./AchievementsSection";
import TechnicalExpertiseSection from "./TechnicalExpertiseSection";
import StrengthsSection from "./StrengthsSection";
import ReferencesSection from "./ReferencesSection";

export default function MainContent() {
  return (
    <div className="w-full md:w-2/3 p-6">
      <SummarySection />
      <ExperienceSection />
      <AchievementsSection />
      <TechnicalExpertiseSection />
      <StrengthsSection />
      <ReferencesSection />
    </div>
  );
}
