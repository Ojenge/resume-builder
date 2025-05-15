import { Progress } from "@/components/ui/progress";

export default function LanguagesSection() {
  const languages = [
    { name: "English", level: "Proficient", percentage: 100 },
    { name: "Swahili", level: "Proficient", percentage: 100 },
    { name: "Spanish", level: "Intermediate", percentage: 65 },
    { name: "Latin", level: "Intermediate", percentage: 65 },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-primary-700 pb-2">Languages</h2>
      <div className="space-y-3">
        {languages.map((language, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span>{language.name}</span>
              <span>{language.level}</span>
            </div>
            <Progress value={language.percentage} className="h-1.5 bg-primary-200" indicatorClassName="bg-primary-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
