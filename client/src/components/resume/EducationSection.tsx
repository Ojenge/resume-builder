export default function EducationSection() {
  const education = [
    {
      degree: "Bachelor of Science in Business Information Technology",
      institution: "Strathmore University",
      years: "2011 - 2014",
      location: "Nairobi, Kenya"
    },
    {
      degree: "Diploma in Business Information Technology",
      institution: "Strathmore University",
      years: "2010 - 2011",
      location: "Nairobi, Kenya"
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-primary-700 pb-2">Education</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index}>
            <h3 className="font-semibold">{edu.degree}</h3>
            <p className="text-sm text-primary-300">{edu.institution}</p>
            <p className="text-sm">{edu.years}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
