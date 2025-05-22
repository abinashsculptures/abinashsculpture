
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, Pencil, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the work item type
type Work = {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
  image: string;
  created_at?: string;
  updated_at?: string;
};

// Schema for form validation
const workFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  category: z.string().min(2, { message: "Category is required." }),
  year: z.coerce.number().min(1900, { message: "Please enter a valid year." }),
});

const AdminWorks: React.FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const { toast } = useToast();

  // Form definition
  const form = useForm<z.infer<typeof workFormSchema>>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      year: new Date().getFullYear(),
    },
  });

  // Fetch works from Supabase
  const fetchWorks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setWorks(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching works",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const openCreateModal = () => {
    setEditingWork(null);
    form.reset({
      title: '',
      description: '',
      category: '',
      year: new Date().getFullYear(),
    });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (work: Work) => {
    setEditingWork(work);
    form.reset({
      title: work.title,
      description: work.description,
      category: work.category,
      year: work.year,
    });
    setImageFile(null);
    setImagePreview(work.image);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: z.infer<typeof workFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      let imagePath = editingWork?.image || '';
      
      // If there's a new image file, upload it
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('works')
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data } = supabase.storage.from('works').getPublicUrl(filePath);
        imagePath = data.publicUrl;
      }
      
      if (!imagePath && !imageFile) {
        throw new Error('Please upload an image');
      }
      
      if (editingWork) {
        // Update existing work
        const { error } = await supabase
          .from('works')
          .update({
            ...values,
            image: imagePath,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingWork.id);
        
        if (error) throw error;
        
        toast({
          title: "Work updated",
          description: "The work has been updated successfully."
        });
      } else {
        // Create new work
        const { error } = await supabase
          .from('works')
          .insert({
            ...values,
            image: imagePath,
          });
        
        if (error) throw error;
        
        toast({
          title: "Work created",
          description: "The new work has been created successfully."
        });
      }
      
      // Refresh works list
      fetchWorks();
      setIsModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work?')) return;
    
    try {
      const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Work deleted",
        description: "The work has been deleted successfully."
      });
      
      // Refresh works list
      fetchWorks();
    } catch (error: any) {
      toast({
        title: "Error deleting work",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Filter works based on search query
  const filteredWorks = works.filter((work) => 
    work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    work.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    work.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Works</h1>
        <Button onClick={openCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Work
        </Button>
      </div>

      {/* Search input */}
      <div className="mb-6">
        <Input
          placeholder="Search works..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Works table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No works found matching your search' : 'No works found. Create your first work!'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorks.map((work) => (
                  <TableRow key={work.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img 
                          src={work.image} 
                          alt={work.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{work.title}</TableCell>
                    <TableCell>{work.category}</TableCell>
                    <TableCell>{work.year}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(work)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(work.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Work Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingWork ? 'Edit Work' : 'Add New Work'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel htmlFor="image-upload">Image</FormLabel>
                <div className="mt-1 flex items-center gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview && (
                    <div className="relative w-16 h-16">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                {!imageFile && !editingWork?.image && (
                  <p className="text-sm text-red-500 mt-1">
                    Please upload an image
                  </p>
                )}
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingWork ? 'Update Work' : 'Create Work'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWorks;
