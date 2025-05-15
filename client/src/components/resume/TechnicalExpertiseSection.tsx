export default function TechnicalExpertiseSection() {
  const programmingSkills = [
    "Python", "PHP", "Shell Scripting", "MongoDB", "ORACLE", "PostgreSQL"
  ];
  
  const businessSkills = [
    "Data Visualization", "Business Intelligence", "Balanced Scorecard", 
    "Strategy Automation", "Project Management", "Program Management", "Sage"
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-primary-900 border-b border-neutral-200 pb-2">
        Technical Expertise
      </h2>
      <div className="flex flex-wrap">
        {programmingSkills.map((skill, index) => (
          <span key={index} className="inline-block px-2 py-1 bg-primary-700 text-white text-xs font-medium rounded-full mr-2 mb-2">
            {skill}
          </span>
        ))}
        {businessSkills.map((skill, index) => (
          <span key={index} className="inline-block px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full mr-2 mb-2">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
