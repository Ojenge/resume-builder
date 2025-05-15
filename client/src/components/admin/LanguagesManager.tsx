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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LanguagesManagerProps {
  profileId: number;
}

interface Language {
  id: number;
  name: string;
  level: string;
  percentage: number;
  profileId: number;
}

interface LanguageFormData {
  name: string;
  level: string;
  percentage: number;
}

export default function LanguagesManager({ profileId }: LanguagesManagerProps) {
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<LanguageFormData>({
    defaultValues: {
      name: "",
      level: "Intermediate",
      percentage: 75
    },
  });

  // Load languages
  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${profileId}/languages`);
      if (response.ok) {
        const data = await response.json();
        setLanguages(data);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
      toast({
        title: "Error",
        description: "Failed to load languages data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchLanguages();
    }
  }, [profileId]);

  // Handle edit item
  const handleEditItem = (item: Language) => {
    form.reset({
      name: item.name,
      level: item.level,
      percentage: item.percentage
    });
    setEditItemId(item.id);
  };

  // Handle delete item
  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this language?")) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/language/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Language deleted successfully",
        });
        fetchLanguages();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete language",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting language:", error);
      toast({
        title: "Error",
        description: "Failed to delete language",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit (create/update)
  const onSubmit = async (values: LanguageFormData) => {
    try {
      setLoading(true);
      
      if (editItemId) {
        // Update existing item
        const response = await fetch(`/api/language/${editItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Language updated successfully",
          });
          setEditItemId(null);
          form.reset({
            name: "",
            level: "Intermediate",
            percentage: 75
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update language",
            variant: "destructive"
          });
        }
      } else {
        // Create new item
        const response = await fetch('/api/language', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...values, profileId })
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Language added successfully",
          });
          form.reset({
            name: "",
            level: "Intermediate",
            percentage: 75
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add language",
            variant: "destructive"
          });
        }
      }
      
      fetchLanguages();
    } catch (error) {
      console.error("Error saving language:", error);
      toast({
        title: "Error",
        description: "Failed to save language",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getLevelPercentage = (level: string) => {
    switch (level) {
      case "Beginner": return 25;
      case "Intermediate": return 50;
      case "Advanced": return 75;
      case "Proficient": return 100;
      default: return 50;
    }
  };

  // When level changes, update percentage
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'level') {
        const level = value.level as string;
        form.setValue('percentage', getLevelPercentage(level));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Languages</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Language Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Proficient">Proficient</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Percentage: {field.value}%</FormLabel>
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
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editItemId ? "Update Language" : "Add Language"}
            </Button>
            
            {editItemId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditItemId(null);
                  form.reset({
                    name: "",
                    level: "Intermediate",
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
        {languages.map((language) => (
          <Card key={language.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1">
                  <h3 className="font-medium">{language.name}</h3>
                </div>
                <div className="ml-4 flex items-start gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleEditItem(language)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDeleteItem(language.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span>{language.level}</span>
                <span>{language.percentage}%</span>
              </div>
              <Progress value={language.percentage} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
        
        {languages.length === 0 && (
          <p className="text-center text-gray-500 my-4">No languages added yet.</p>
        )}
      </div>
    </div>
  );
}