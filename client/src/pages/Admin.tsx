import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import ProfileForm from "@/components/admin/ProfileForm";
import EducationManager from "@/components/admin/EducationManager";
import SkillsManager from "@/components/admin/SkillsManager";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileId, setProfileId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have profile data in the database
    const fetchData = async () => {
      try {
        const response = await fetch('/api/resume/1');
        if (response.ok) {
          const data = await response.json();
          if (data.profile) {
            setProfileId(data.profile.id);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchData();
  }, []);

  const handlePopulateData = async () => {
    try {
      const response = await fetch('/api/populate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (response.ok) {
        const data = await response.json();
        setProfileId(data.profileId);
        toast({
          title: "Success",
          description: "Resume data populated successfully",
        });
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to populate resume data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error populating data:", error);
      toast({
        title: "Error",
        description: "Failed to populate resume data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary-800">Resume Management</h1>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" className="bg-primary-100 text-primary-800 hover:bg-primary-200">
                View Resume
              </Button>
            </Link>
            {!profileId && (
              <Button 
                onClick={handlePopulateData}
                className="bg-primary-600 text-white hover:bg-primary-700"
              >
                Initialize Sample Data
              </Button>
            )}
          </div>
        </div>

        {profileId ? (
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <TabsContent value="profile">
                <ProfileForm profileId={profileId} />
              </TabsContent>
              
              <TabsContent value="education">
                <EducationManager profileId={profileId} />
              </TabsContent>
              
              <TabsContent value="skills">
                <SkillsManager profileId={profileId} />
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
            <h2 className="text-xl font-semibold mb-4">No Profile Found</h2>
            <p className="text-gray-600 mb-4">
              You need to initialize the database with sample data or create a new profile to get started.
            </p>
            <Button 
              onClick={handlePopulateData}
              className="bg-primary-600 text-white hover:bg-primary-700 px-6 py-3"
            >
              Initialize Sample Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}