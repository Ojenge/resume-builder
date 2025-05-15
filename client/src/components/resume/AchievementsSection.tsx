export default function AchievementsSection() {
  const achievements = [
    {
      percentage: 70,
      description: "Enhanced accountability by developing dashboards that analyze donor funded projects to monitor utilization of funds"
    },
    {
      percentage: 40,
      description: "Improved decision making by government executive by creating GPRS which enables tracking & troubleshooting of priority development projects"
    },
    {
      percentage: 33,
      description: "Cost reduction by creating performance management systems for Longhorn Publishers and NCBA"
    },
    {
      percentage: 43,
      description: "Improved efficiency of government agencies by creating a GPRS system that coordinates projects across all government agencies"
    },
    {
      percentage: 30,
      description: "Saved time for government agencies by creating and maintaining government database servers that contain national projects data"
    },
    {
      percentage: 38,
      description: "Improved employee productivity in Longhorn Publishers and NCBA through strategic alignment initiatives"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-primary-900 border-b border-neutral-200 pb-2">
        Key Achievements
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement, index) => (
          <div key={index} className="bg-primary-50 p-4 rounded-lg border border-primary-100">
            <div className="flex items-center">
              <div className="text-2xl text-primary-600 font-bold mr-3">{achievement.percentage}%</div>
              <p className="text-neutral-700">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
