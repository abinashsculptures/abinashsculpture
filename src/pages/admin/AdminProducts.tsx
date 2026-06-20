
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SpecItem {
  label: string;
  value: string;
}

interface VariantForm {
  size: string;
  price: string;
  imagesText: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  images: string[] | null;
  features: string[] | null;
  specifications: SpecItem[] | null;
  variants: any;
  price: number | null;
  availability: string;
  created_at: string;
}

// Parse "Label: Value" lines into spec items
const parseSpecs = (text: string): SpecItem[] =>
  text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const idx = line.indexOf(':');
      if (idx === -1) return { label: line, value: '' };
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    });

const specsToText = (specs: SpecItem[] | null) =>
  (specs || []).map(s => `${s.label}: ${s.value}`).join('\n');

const linesToArray = (text: string): string[] =>
  text.split('\n').map(l => l.trim()).filter(Boolean);

const arrayToLines = (arr: string[] | null) => (arr || []).join('\n');

const variantsFromDb = (raw: any): VariantForm[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((v: any) => ({
    size: typeof v?.size === 'string' ? v.size : '',
    price: v?.price === null || v?.price === undefined ? '' : String(v.price),
    imagesText: Array.isArray(v?.images) ? v.images.join('\n') : '',
  }));
};

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imagesText: '',      // one URL per line, unlimited
    featuresText: '',    // one feature per line
    specsText: '',       // "Label: Value" per line
    price: '',
    availability: 'in_stock'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data as any) || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching products',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      imagesText: '',
      featuresText: '',
      specsText: '',
      price: '',
      availability: 'in_stock'
    });
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    const imgs = (product.images && product.images.length > 0)
      ? product.images
      : (product.image ? [product.image] : []);
    setFormData({
      title: product.title,
      description: product.description || '',
      category: product.category || '',
      imagesText: imgs.join('\n'),
      featuresText: arrayToLines(product.features),
      specsText: specsToText(product.specifications),
      price: product.price ? product.price.toString() : '',
      availability: product.availability || 'in_stock'
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (value: string) => {
    setFormData(prev => ({ ...prev, availability: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const images = linesToArray(formData.imagesText);
    const features = linesToArray(formData.featuresText);
    const specifications = parseSpecs(formData.specsText);

    if (images.length === 0) {
      toast({
        title: 'Image required',
        description: 'Please add at least one image URL.',
        variant: 'destructive'
      });
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      image: images[0], // keep primary image in legacy field
      images,
      features,
      specifications,
      price: formData.price ? parseFloat(formData.price) : null,
      availability: formData.availability
    };

    try {
      if (isEditing && currentProduct) {
        const { error } = await supabase
          .from('products')
          .update(payload as any)
          .eq('id', currentProduct.id);
        if (error) throw error;
        toast({ title: 'Product updated', description: 'The product has been updated successfully' });
      } else {
        const { error } = await supabase.from('products').insert(payload as any);
        if (error) throw error;
        toast({ title: 'Product added', description: 'The new product has been added successfully' });
      }
      fetchProducts();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(product => product.id !== id));
      toast({ title: 'Product deleted', description: 'The product has been deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    }
  };

  const getAvailabilityBadge = (availability: string) =>
    availability === 'in_stock'
      ? <span className="badge-available">In Stock</span>
      : <span className="badge-out-of-stock">Out of Stock</span>;

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={handleAddNewClick}>Add New Product</Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const imgCount = (product.images && product.images.length) || (product.image ? 1 : 0);
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price ? `₹${product.price}` : 'N/A'}</TableCell>
                  <TableCell>{imgCount}</TableCell>
                  <TableCell>{getAvailabilityBadge(product.availability)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(product)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the product details below' : 'Fill in the details to add a new product'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imagesText">Image URLs (one per line — unlimited, first is the main image)</Label>
                <Textarea
                  id="imagesText"
                  name="imagesText"
                  value={formData.imagesText}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={'https://example.com/img1.jpg\nhttps://example.com/img2.jpg'}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="featuresText">Features (one bullet per line)</Label>
                <Textarea
                  id="featuresText"
                  name="featuresText"
                  value={formData.featuresText}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={'Hand carved by master artisans\nMade from premium black granite\nIdeal for home or temple'}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specsText">Specifications (one per line — format: Label: Value)</Label>
                <Textarea
                  id="specsText"
                  name="specsText"
                  value={formData.specsText}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={'Material: Black Granite\nHeight: 24 inches\nWeight: 18 kg'}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={formData.availability} onValueChange={handleAvailabilityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {isEditing ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
