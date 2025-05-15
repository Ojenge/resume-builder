import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AchievementsManagerProps {
  profileId: number;
}

interface Achievement {
  id: number;
  percentage: number;
  description: string;
  profileId: number;
}

interface AchievementFormData {
  percentage: number;
  description: string;
}

export default function AchievementsManager({ profileId }: AchievementsManagerProps) {
  const [loading, setLoading] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<AchievementFormData>({
    defaultValues: {
      percentage: 50,
      description: ""
    },
  });

  // Load achievements
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${profileId}/achievements`);
      if (response.ok) {
        const data = await response.json();
        setAchievements(data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast({
        title: "Error",
        description: "Failed to load achievements data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchAchievements();
    }
  }, [profileId]);

  // Handle edit item
  const handleEditItem = (item: Achievement) => {
    form.reset({
      percentage: item.percentage,
      description: item.description
    });
    setEditItemId(item.id);
  };

  // Handle delete item
  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this achievement?")) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/achievement/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Achievement deleted successfully",
        });
        fetchAchievements();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete achievement",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast({
        title: "Error",
        description: "Failed to delete achievement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit (create/update)
  const onSubmit = async (values: AchievementFormData) => {
    try {
      setLoading(true);
      
      if (editItemId) {
        // Update existing item
        const response = await fetch(`/api/achievement/${editItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Achievement updated successfully",
          });
          setEditItemId(null);
          form.reset({
            percentage: 50,
            description: ""
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update achievement",
            variant: "destructive"
          });
        }
      } else {
        // Create new item
        const response = await fetch('/api/achievement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...values, profileId })
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Achievement added successfully",
          });
          form.reset({
            percentage: 50,
            description: ""
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add achievement",
            variant: "destructive"
          });
        }
      }
      
      fetchAchievements();
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast({
        title: "Error",
        description: "Failed to save achievement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Key Achievements</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Improvement/Success Percentage: {field.value}%</FormLabel>
                <FormControl>
                  <Slider 
                    value={[field.value]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(values) => field.onChange(values[0])}
                    className="py-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Achievement Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your achievement" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editItemId ? "Update Achievement" : "Add Achievement"}
            </Button>
            
            {editItemId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditItemId(null);
                  form.reset({
                    percentage: 50,
                    description: ""
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
      
      <div className="grid grid-cols-1 gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-primary-600">{achievement.percentage}%</span>
                    <p className="text-neutral-700">{achievement.description}</p>
                  </div>
                </div>
                <div className="ml-4 flex items-start gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleEditItem(achievement)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDeleteItem(achievement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {achievements.length === 0 && (
          <p className="text-center text-gray-500 my-4">No achievements added yet.</p>
        )}
      </div>
    </div>
  );
}