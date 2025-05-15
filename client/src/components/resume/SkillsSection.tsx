import { Progress } from "@/components/ui/progress";

export default function SkillsSection() {
  const skills = [
    { name: "Software Development", percentage: 90 },
    { name: "Data Analysis", percentage: 95 },
    { name: "Project Management", percentage: 85 },
    { name: "Database Development", percentage: 90 },
    { name: "Strategy Tools", percentage: 85 },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-primary-700 pb-2">Skills</h2>
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="font-medium">{skill.name}</span>
              <span>{skill.percentage}%</span>
            </div>
            <Progress value={skill.percentage} className="h-1.5 bg-primary-200" indicatorClassName="bg-primary-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
