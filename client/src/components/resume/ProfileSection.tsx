export default function ProfileSection() {
  return (
    <div className="mb-8 text-center">
      <div className="w-32 h-32 mx-auto mb-4 bg-primary-700 rounded-full flex items-center justify-center text-4xl font-bold">
        CO
      </div>
      <h1 className="text-2xl font-bold uppercase tracking-wider">Collins Ojenge</h1>
      <p className="text-primary-300 mt-1">Systems & Automation Director</p>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center">
          <i className="ri-phone-line mr-2"></i>
          <span>+254 723 722 204</span>
        </div>
        <div className="flex items-center justify-center">
          <i className="ri-mail-line mr-2"></i>
          <span>collinsojenge@gmail.com</span>
        </div>
        <div className="flex items-center justify-center">
          <i className="ri-map-pin-line mr-2"></i>
          <span>Nairobi, Kenya</span>
        </div>
      </div>
    </div>
  );
}
