import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed bottom-6 right-6 print:hidden">
      <Button
        onClick={handlePrint}
        className="rounded-full shadow-lg bg-primary-600 hover:bg-primary-700 text-white"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Resume
      </Button>
    </div>
  );
}
