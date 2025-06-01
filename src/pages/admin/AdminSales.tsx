
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, Pencil, Trash2, Upload, X, Loader2, Link, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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

// Define the sale item type
type Sale = {
  id: string;
  title: string;
  description: string;
  details: string;
  poster_image: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

// Schema for form validation
const saleFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  details: z.string().min(10, { message: "Details must be at least 10 characters." }),
  is_active: z.boolean(),
});

const AdminSales: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('upload');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const { toast } = useToast();

  // Form definition
  const form = useForm<z.infer<typeof saleFormSchema>>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      title: '',
      description: '',
      details: '',
      is_active: true,
    },
  });

  // Fetch sales from Supabase
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSales(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching sales",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    setImageUrl('');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null);
    setImagePreview(url);
  };

  const clearImage = () => {
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const openCreateModal = () => {
    setEditingSale(null);
    form.reset({
      title: '',
      description: '',
      details: '',
      is_active: true,
    });
    setImageFile(null);
    setImageUrl('');
    setImagePreview(null);
    setImageInputType('upload');
    setIsModalOpen(true);
  };

  const openEditModal = (sale: Sale) => {
    setEditingSale(sale);
    form.reset({
      title: sale.title,
      description: sale.description,
      details: sale.details,
      is_active: sale.is_active,
    });
    setImageFile(null);
    setImageUrl(sale.poster_image);
    setImagePreview(sale.poster_image);
    setImageInputType('url');
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: z.infer<typeof saleFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      let imagePath = editingSale?.poster_image || '';
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('sales')
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from('sales').getPublicUrl(filePath);
        imagePath = data.publicUrl;
      } else if (imageUrl) {
        imagePath = imageUrl;
      }
      
      if (!imagePath && !imageFile && !imageUrl) {
        throw new Error('Please upload an image or provide an image URL');
      }
      
      if (editingSale) {
        const { error } = await supabase
          .from('sales')
          .update({
            title: values.title,
            description: values.description,
            details: values.details,
            poster_image: imagePath,
            is_active: values.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSale.id);
        
        if (error) throw error;
        
        toast({
          title: "Sale updated",
          description: "The sale has been updated successfully."
        });
      } else {
        const { error } = await supabase
          .from('sales')
          .insert({
            title: values.title,
            description: values.description,
            details: values.details,
            poster_image: imagePath,
            is_active: values.is_active,
          });
        
        if (error) throw error;
        
        toast({
          title: "Sale created",
          description: "The new sale has been created successfully."
        });
      }
      
      fetchSales();
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
    if (!confirm('Are you sure you want to delete this sale?')) return;
    
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Sale deleted",
        description: "The sale has been deleted successfully."
      });
      
      fetchSales();
    } catch (error: any) {
      toast({
        title: "Error deleting sale",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const toggleSaleStatus = async (sale: Sale) => {
    try {
      const { error } = await supabase
        .from('sales')
        .update({ is_active: !sale.is_active })
        .eq('id', sale.id);
      
      if (error) throw error;
      
      toast({
        title: "Sale status updated",
        description: `Sale has been ${!sale.is_active ? 'activated' : 'deactivated'}.`
      });
      
      fetchSales();
    } catch (error: any) {
      toast({
        title: "Error updating sale status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredSales = sales.filter((sale) => 
    sale.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Sales</h1>
        <Button onClick={openCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Sale
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search sales..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

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
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No sales found matching your search' : 'No sales found. Create your first sale!'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img 
                          src={sale.poster_image} 
                          alt={sale.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{sale.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{sale.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {sale.is_active ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        )}
                        <span className={sale.is_active ? 'text-green-500' : 'text-gray-500'}>
                          {sale.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => toggleSaleStatus(sale)}>
                        {sale.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditModal(sale)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(sale.id)}>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSale ? 'Edit Sale' : 'Add New Sale'}</DialogTitle>
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
                      <Input placeholder="Enter sale title" {...field} />
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
                      <Textarea placeholder="Enter sale description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter detailed information about the sale" 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show this sale on the website
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Poster Image</FormLabel>
                
                <div className="flex gap-2 mt-1 mb-2">
                  <Button
                    type="button"
                    variant={imageInputType === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageInputType('upload')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={imageInputType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageInputType('url')}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Image URL
                  </Button>
                </div>

                {imageInputType === 'upload' ? (
                  <div className="flex items-center gap-4">
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
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter image URL"
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                    />
                    {imagePreview && (
                      <div className="relative w-16 h-16">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded border"
                          onError={() => setImagePreview(null)}
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
                )}
                
                {!imageFile && !imageUrl && (
                  <p className="text-sm text-red-500 mt-1">
                    Please upload an image or provide an image URL
                  </p>
                )}
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSale ? 'Update Sale' : 'Create Sale'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSales;
