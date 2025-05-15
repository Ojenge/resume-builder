export default function ReferencesSection() {
  const references = [
    {
      name: "Dr. Jude Mwenda Ntabathia",
      title: "Independent Researcher",
      location: "Nairobi, Kenya",
      email: "judemwenda@gmail.com",
      phone: "+254 793 955 045"
    },
    {
      name: "Nicodemus Maingi",
      title: "Senior Lecturer",
      location: "Strathmore University, Nairobi",
      email: "nmaingi@strathmore.edu",
      phone: "+254 733 499 437"
    },
    {
      name: "Maurice Kimani",
      title: "Inclusive Investment Manager",
      location: "CASA Plus at TechnoServe",
      email: "kimani.maurice@gmail.com",
      phone: "+254 723 688 899"
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-primary-900 border-b border-neutral-200 pb-2">
        References
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {references.map((reference, index) => (
          <div key={index} className="bg-neutral-50 p-3 rounded border border-neutral-200">
            <h3 className="font-semibold text-primary-800">{reference.name}</h3>
            <p className="text-sm text-neutral-600">{reference.title}</p>
            <p className="text-sm text-neutral-600">{reference.location}</p>
            <div className="mt-2 text-sm">
              <div className="flex items-center">
                <i className="ri-mail-line text-primary-600 mr-1"></i>
                <span>{reference.email}</span>
              </div>
              <div className="flex items-center">
                <i className="ri-phone-line text-primary-600 mr-1"></i>
                <span>{reference.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
