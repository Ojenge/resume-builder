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

interface CertificationsManagerProps {
  profileId: number;
}

interface Certification {
  id: number;
  name: string;
  organization: string;
  profileId: number;
}

interface CertificationFormData {
  name: string;
  organization: string;
}

export default function CertificationsManager({ profileId }: CertificationsManagerProps) {
  const [loading, setLoading] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const { toast } = useToast();
  
  const form = useForm<CertificationFormData>({
    defaultValues: {
      name: "",
      organization: ""
    },
  });

  // Load certifications
  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/${profileId}/certifications`);
      if (response.ok) {
        const data = await response.json();
        setCertifications(data);
      }
    } catch (error) {
      console.error("Error fetching certifications:", error);
      toast({
        title: "Error",
        description: "Failed to load certifications data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchCertifications();
    }
  }, [profileId]);

  // Handle edit item
  const handleEditItem = (item: Certification) => {
    form.reset({
      name: item.name,
      organization: item.organization
    });
    setEditItemId(item.id);
  };

  // Handle delete item
  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certification?")) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/certification/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Certification deleted successfully",
        });
        fetchCertifications();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete certification",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit (create/update)
  const onSubmit = async (values: CertificationFormData) => {
    try {
      setLoading(true);
      
      if (editItemId) {
        // Update existing item
        const response = await fetch(`/api/certification/${editItemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Certification updated successfully",
          });
          setEditItemId(null);
          form.reset({
            name: "",
            organization: ""
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update certification",
            variant: "destructive"
          });
        }
      } else {
        // Create new item
        const response = await fetch('/api/certification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...values, profileId })
        });

        if (response.ok) {
          toast({
            title: "Success",
            description: "Certification added successfully",
          });
          form.reset({
            name: "",
            organization: ""
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add certification",
            variant: "destructive"
          });
        }
      }
      
      fetchCertifications();
    } catch (error) {
      console.error("Error saving certification:", error);
      toast({
        title: "Error",
        description: "Failed to save certification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Certifications</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Name</FormLabel>
                <FormControl>
                  <Input placeholder="Certification Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issuing Organization</FormLabel>
                <FormControl>
                  <Input placeholder="Issuing Organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editItemId ? "Update Certification" : "Add Certification"}
            </Button>
            
            {editItemId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditItemId(null);
                  form.reset({
                    name: "",
                    organization: ""
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
        {certifications.map((certification) => (
          <Card key={certification.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{certification.name}</h3>
                  <p className="text-sm text-gray-500">{certification.organization}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleEditItem(certification)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDeleteItem(certification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {certifications.length === 0 && (
          <p className="text-center text-gray-500 my-4">No certifications added yet.</p>
        )}
      </div>
    </div>
  );
}