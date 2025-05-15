export default function CertificationsSection() {
  const certifications = [
    {
      name: "Certified Public Accountant (CPA II)",
      organization: "KASNEB 2011",
    },
    {
      name: "ORACLE DB Certification",
      organization: "Strathmore University",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-primary-700 pb-2">Certifications</h2>
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div key={index}>
            <h3 className="font-semibold">{cert.name}</h3>
            <p className="text-sm">{cert.organization}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
