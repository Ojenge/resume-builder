import Sidebar from "@/components/resume/Sidebar";
import MainContent from "@/components/resume/MainContent";
import PrintButton from "@/components/resume/PrintButton";
import { useEffect } from "react";

export default function Resume() {
  // Set page title
  useEffect(() => {
    document.title = "Collins Ojenge - Systems & Automation Director Resume";
  }, []);

  return (
    <div className="bg-neutral-100 min-h-screen font-sans">
      <div className="flex justify-center items-center min-h-screen p-4 print:p-0">
        <div className="print-container bg-white shadow-xl max-w-5xl w-full mx-auto overflow-hidden relative">
          <div className="flex flex-col md:flex-row">
            <Sidebar />
            <MainContent />
          </div>
        </div>
      </div>
      <PrintButton />
    </div>
  );
}
