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
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SkillsManagerProps {
  profileId: number;
}

interface Skill {
  id: number;
  name: string;
  percentage: number;
  profileId: number;
}

interface SkillFormData {
  name: string;
  percentage: number;
}

export default function SkillsManager({ profileId }: SkillsManagerProps) {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<SkillFormData>({
    defaultValues: {
      name: "",
      percentage: 75
    },
  });

  // Load skills
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${profileId}/skills`);
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast({
        title: "Error",
        description: "Failed to load skills data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchSkills();
    }
  }, [profileId]);

  // Handle edit item
  const handleEditItem = (item: Skill) => {
    form.reset({
      name: item.name,
      percentage: item.percentage
    });
    setEditItemId(item.id);
  };

  // Handle delete item
  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/skill/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Skill deleted successfully",
        });
        fetchSkills();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete skill",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit (create/update)
  const onSubmit = async (values: SkillFormData) => {
    try {
      setLoading(true);
      
      if (editItemId) {
        // Update existing item
        const response = await fetch(`/api/skill/${editItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Skill updated successfully",
          });
          setEditItemId(null);
          form.reset({
            name: "",
            percentage: 75
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update skill",
            variant: "destructive"
          });
        }
      } else {
        // Create new item
        const response = await fetch('/api/skill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...values, profileId })
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Skill added successfully",
          });
          form.reset({
            name: "",
            percentage: 75
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add skill",
            variant: "destructive"
          });
        }
      }
      
      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast({
        title: "Error",
        description: "Failed to save skill",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Skills</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Name</FormLabel>
                <FormControl>
                  <Input placeholder="Skill Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proficiency Level: {field.value}%</FormLabel>
                <FormControl>
                  <Slider 
                    defaultValue={[field.value]} 
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
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editItemId ? "Update Skill" : "Add Skill"}
            </Button>
            
            {editItemId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditItemId(null);
                  form.reset({
                    name: "",
                    percentage: 75
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
        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1">
                  <h3 className="font-medium">{skill.name}</h3>
                </div>
                <div className="ml-4 flex items-start gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleEditItem(skill)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDeleteItem(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span>Proficiency</span>
                <span>{skill.percentage}%</span>
              </div>
              <Progress value={skill.percentage} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
        
        {skills.length === 0 && (
          <p className="text-center text-gray-500 my-4">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}