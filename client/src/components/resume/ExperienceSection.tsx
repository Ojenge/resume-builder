export default function ExperienceSection() {
  const experiences = [
    {
      title: "Data Analyst / Systems & Automation Director",
      company: "Statehouse / Ministry of Defence / President's Delivery Unit",
      period: "Aug 2018 - Present",
      location: "Nairobi, Kenya",
      description: "Accent analytics is a performance management and business intelligence platform that optimizes and automates strategies, processes, and performances.",
      responsibilities: [
        "Development and maintenance of Government Performance Reporting Software (GPRS)",
        "Development and maintenance of a database server containing national projects data for GPRS",
        "Server orchestration and maintenance of the official PDU servers",
        "Development and maintenance of the delivery portal (www.delivery.go.ke)",
        "Managing the procurement, deployment and maintenance of Hardware and software for PDU",
        "Development, testing and rolling out new software features for GPRS",
        "Working with county field officers in the collection and analysis of project-based data for reporting purposes",
        "Supporting county and ministry teams in report preparation for National Development Implementation Technical Committee meetings",
        "Supporting management of virtual National Development Implementation Cabinet Committee meetings",
        "Worked with Presidential Policy and Strategy Unit to develop dashboards analyzing donor funded projects"
      ]
    },
    {
      title: "Strategy & Automation Consultant",
      company: "Accent Analytics - KEPSA Project",
      period: "Feb 2015 - Present",
      location: "Nairobi, Kenya",
      description: "Accent analytics is a performance management and business intelligence platform that optimizes and automates strategies, processes, and performances.",
      responsibilities: [
        "Designed and automated a framework capturing the 5-year strategic plan including operational and human resource strategy",
        "Automated the Balanced Scorecard and customized it to fit the firm's strategy, objectives and KPIs",
        "Led integration of the automated Balanced Scorecard by training existing and incoming staff members",
        "Customization of Accent Analytics to fit their unique needs as a publisher",
        "Automation of their strategic plan over a 2-year period",
        "Development of custom dashboards to aid in data-based decision-making across different managerial levels",
        "Trained the team on Balanced Scorecard principles",
        "Alignment of employees' roles and objectives with the overall strategic goals of the organization"
      ]
    },
    {
      title: "IT Consultant",
      company: "Longhorn Publishers",
      period: "Contractual Project",
      location: "Nairobi, Kenya",
      description: "Longhorn Publishers is a leading provider of innovative publishing solutions in East Africa.",
      responsibilities: [
        "Designed and automated a framework capturing the 5-year strategic plan",
        "Automated the Balanced Scorecard and customized it to fit the firm's strategy, objectives and KPIs",
        "Led integration of the automated Balanced Scorecard by training staff members",
        "Development of custom dashboards for data-based decision-making across managerial levels",
        "Trained the team on Balanced Scorecard principles",
        "Aligned employees' roles and objectives with the organization's strategic goals"
      ]
    },
    {
      title: "IT Consultant",
      company: "Commercial Bank of Africa (now NCBA)",
      period: "Contractual Project",
      location: "Nairobi, Kenya",
      description: "",
      responsibilities: [
        "Automated scorecards for Kenya, Uganda and Tanzania on Quick score",
        "Analyzed data collected over a one-year period and developed actionable insights for various business units",
        "Assisted the strategy department to develop objectives and KPIs for different business units across East Africa"
      ]
    },
    {
      title: "Database Developer",
      company: "Clinton Health Access Initiative (CHAI)",
      period: "June 2013 - June 2015",
      location: "Nairobi, Kenya",
      description: "",
      responsibilities: [
        "Developed a database administration system for CHAI operations in Kenya",
        "Led implementation and spearheaded impact analyses procedures in multiple regions including Turkana, Garissa, Mombasa, and others",
        "Managed a $4M project funded by the Clinton Foundation"
      ]
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-primary-900 border-b border-neutral-200 pb-2">
        Professional Experience
      </h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="bg-neutral-50 p-4 rounded-lg shadow-sm border border-neutral-200">
            <div className="flex justify-between items-start flex-wrap">
              <div>
                <h3 className="text-lg font-semibold text-primary-800">{exp.title}</h3>
                <p className="text-primary-600 font-medium">{exp.company}</p>
              </div>
              <div className="text-right text-sm text-neutral-600">
                <p>{exp.period}</p>
                <p>{exp.location}</p>
              </div>
            </div>
            {exp.description && (
              <p className="mt-2 text-neutral-600 italic">{exp.description}</p>
            )}
            <ul className="mt-3 space-y-2 text-neutral-700 list-disc pl-5">
              {exp.responsibilities.map((responsibility, rIndex) => (
                <li key={rIndex}>{responsibility}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
