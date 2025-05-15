export default function StrengthsSection() {
  const strengths = [
    {
      title: "Excellent Communication Skills",
      description: "Communicates and interacts effectively with colleagues and team members",
      icon: "ri-chat-4-line"
    },
    {
      title: "Detail Oriented",
      description: "Thoroughness in accomplishing tasks through concern for all areas involved",
      icon: "ri-search-eye-line"
    },
    {
      title: "Problem Solving",
      description: "High ability to make timely, well-considered and logical decisions in challenging situations",
      icon: "ri-lightbulb-line"
    },
    {
      title: "Honesty & Integrity",
      description: "Truthful and consistent with uncompromising adherence to strong moral and ethical principles",
      icon: "ri-shield-check-line"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-primary-900 border-b border-neutral-200 pb-2">
        Professional Strengths
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strengths.map((strength, index) => (
          <div key={index} className="flex">
            <div className="mr-3 text-primary-600 text-xl">
              <i className={strength.icon}></i>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800">{strength.title}</h3>
              <p className="text-sm text-neutral-600">{strength.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
