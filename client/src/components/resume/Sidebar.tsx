import ProfileSection from "./ProfileSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import LanguagesSection from "./LanguagesSection";
import CertificationsSection from "./CertificationsSection";
import TimeAllocationChart from "./TimeAllocationChart";

export default function Sidebar() {
  return (
    <div className="w-full md:w-1/3 bg-primary-800 text-white p-6">
      <ProfileSection />
      <EducationSection />
      <SkillsSection />
      <LanguagesSection />
      <CertificationsSection />
      <TimeAllocationChart />
    </div>
  );
}
