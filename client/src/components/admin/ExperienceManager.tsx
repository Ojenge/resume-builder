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
import { Pencil, Trash2, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExperienceManagerProps {
  profileId: number;
}

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string | null;
  responsibilities: string[];
  profileId: number;
  displayOrder: number;
}

interface ExperienceFormData {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  displayOrder: number;
}

export default function ExperienceManager({ profileId }: ExperienceManagerProps) {
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const { toast } = useToast();
  
  const form = useForm<ExperienceFormData>({
    defaultValues: {
      title: "",
      company: "",
      period: "",
      location: "",
      description: "",
      responsibilities: [''],
      displayOrder: 1
    },
  });

  // Load experiences
  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${profileId}/experiences`);
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast({
        title: "Error",
        description: "Failed to load experiences data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchExperiences();
    }
  }, [profileId]);

  // Handle edit item
  const handleEditItem = (item: Experience) => {
    form.reset({
      title: item.title,
      company: item.company,
      period: item.period,
      location: item.location,
      description: item.description || '',
      responsibilities: item.responsibilities,
      displayOrder: item.displayOrder
    });
    setResponsibilities(item.responsibilities);
    setEditItemId(item.id);
  };

  // Handle delete item
  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience item?")) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Experience deleted successfully",
        });
        fetchExperiences();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete experience",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit (create/update)
  const onSubmit = async (values: ExperienceFormData) => {
    try {
      setLoading(true);
      
      // Filter out empty responsibilities
      const filteredResponsibilities = responsibilities.filter(r => r.trim() !== '');
      const dataToSubmit = {
        ...values,
        responsibilities: filteredResponsibilities
      };
      
      if (editItemId) {
        // Update existing item
        const response = await fetch(`/api/experience/${editItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSubmit)
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Experience updated successfully",
          });
          setEditItemId(null);
          resetForm();
        } else {
          toast({
            title: "Error",
            description: "Failed to update experience",
            variant: "destructive"
          });
        }
      } else {
        // Create new item
        const response = await fetch('/api/experience', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...dataToSubmit, profileId })
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Experience added successfully",
          });
          resetForm();
        } else {
          toast({
            title: "Error",
            description: "Failed to add experience",
            variant: "destructive"
          });
        }
      }
      
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.reset({
      title: "",
      company: "",
      period: "",
      location: "",
      description: "",
      responsibilities: [''],
      displayOrder: 1
    });
    setResponsibilities(['']);
  };

  const addResponsibility = () => {
    setResponsibilities([...responsibilities, '']);
  };

  const removeResponsibility = (index: number) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities.splice(index, 1);
    setResponsibilities(newResponsibilities);
  };

  const updateResponsibility = (index: number, value: string) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[index] = value;
    setResponsibilities(newResponsibilities);
    form.setValue('responsibilities', newResponsibilities);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Professional Experience</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Job Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company / Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Company / Organization" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jan 2020 - Present" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order (1 = first)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      placeholder="Display Order"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief description of the company" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>Responsibilities / Achievements</FormLabel>
            <div className="space-y-3 mt-2">
              {responsibilities.map((responsibility, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    value={responsibility}
                    onChange={(e) => updateResponsibility(index, e.target.value)}
                    placeholder={`Responsibility #${index + 1}`}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => removeResponsibility(index)}
                    disabled={responsibilities.length <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={addResponsibility}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Responsibility
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editItemId ? "Update Experience" : "Add Experience"}
            </Button>
            
            {editItemId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditItemId(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
      
      <div className="grid grid-cols-1 gap-4">
        {experiences.map((experience) => (
          <Card key={experience.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{experience.title}</h3>
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                      Order: {experience.displayOrder}
                    </span>
                  </div>
                  <p className="text-primary-600">{experience.company}</p>
                  <p className="text-sm text-neutral-500">{experience.period} | {experience.location}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleEditItem(experience)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDeleteItem(experience.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {experience.description && (
                <p className="text-sm text-neutral-600 italic mb-2">{experience.description}</p>
              )}
              
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Responsibilities:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {experience.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {experiences.length === 0 && (
          <p className="text-center text-gray-500 my-4">No experience items added yet.</p>
        )}
      </div>
    </div>
  );
}