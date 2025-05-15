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
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EducationManagerProps {
  profileId: number;
}

interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  years: string;
  location: string;
  profileId: number;
}

interface EducationFormData {
  degree: string;
  institution: string;
  years: string;
  location: string;
}

export default function EducationManager({ profileId }: EducationManagerProps) {
  const [loading, setLoading] = useState(false);
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<EducationFormData>({
    defaultValues: {
      degree: "",
      institution: "",
      years: "",
      location: ""
    },
  });

  // Load education items
  const fetchEducationItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${profileId}/education`);
      if (response.ok) {
        const data = await response.json();
        setEducationItems(data);
      }
    } catch (error) {
      console.error("Error fetching education items:", error);
      toast({
        title: "Error",
        description: "Failed to load education data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchEducationItems();
    }
  }, [profileId]);

  // Handle edit item
  const handleEditItem = (item: EducationItem) => {
    form.reset({
      degree: item.degree,
      institution: item.institution,
      years: item.years,
      location: item.location
    });
    setEditItemId(item.id);
  };

  // Handle delete item
  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education item?")) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Education item deleted successfully",
        });
        fetchEducationItems();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete education item",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting education item:", error);
      toast({
        title: "Error",
        description: "Failed to delete education item",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit (create/update)
  const onSubmit = async (values: EducationFormData) => {
    try {
      setLoading(true);
      
      if (editItemId) {
        // Update existing item
        const response = await fetch(`/api/education/${editItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Education item updated successfully",
          });
          setEditItemId(null);
          form.reset({
            degree: "",
            institution: "",
            years: "",
            location: ""
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update education item",
            variant: "destructive"
          });
        }
      } else {
        // Create new item
        const response = await fetch('/api/education', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...values, profileId })
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Education item added successfully",
          });
          form.reset({
            degree: "",
            institution: "",
            years: "",
            location: ""
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add education item",
            variant: "destructive"
          });
        }
      }
      
      fetchEducationItems();
    } catch (error) {
      console.error("Error saving education item:", error);
      toast({
        title: "Error",
        description: "Failed to save education item",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Education</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree / Qualification</FormLabel>
                  <FormControl>
                    <Input placeholder="Degree / Qualification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="Institution" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2010 - 2014" {...field} />
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
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editItemId ? "Update Education" : "Add Education"}
            </Button>
            
            {editItemId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditItemId(null);
                  form.reset({
                    degree: "",
                    institution: "",
                    years: "",
                    location: ""
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
        {educationItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.degree}</h3>
                  <p className="text-sm text-gray-500">{item.institution}</p>
                  <p className="text-sm">{item.years} | {item.location}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleEditItem(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {educationItems.length === 0 && (
          <p className="text-center text-gray-500 my-4">No education items added yet.</p>
        )}
      </div>
    </div>
  );
}