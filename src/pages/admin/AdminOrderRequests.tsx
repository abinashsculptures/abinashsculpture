
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Define the type for order requests based on the Supabase schema
interface OrderRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  timeline: string | null; // Used for statueName in the frontend
  budget: string | null; // Used for sculptureSize in the frontend
  description: string;
  status: string;
  created_at: string;
}

const AdminOrderRequests: React.FC = () => {
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch order requests from Supabase
  const fetchOrderRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('order_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrderRequests(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching order requests',
        description: error.message,
        variant: 'destructive',
      });
      console.error('Error fetching order requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('order_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state to reflect the change
      setOrderRequests(
        orderRequests.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: 'Status updated',
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
      console.error('Error updating status:', error);
    }
  };

  // Filter orders based on search term
  const filteredOrders = orderRequests.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.timeline && order.timeline.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Load orders on component mount
  useEffect(() => {
    fetchOrderRequests();
  }, []);

  // Helper function to get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in progress':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500'; // new or other status
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Requests</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => fetchOrderRequests()} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading order requests...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-gray-500">
              {searchTerm ? 'No orders match your search.' : 'No order requests found.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Order Requests ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Statue Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.name}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                        {order.phone && (
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{order.service_type}</TableCell>
                    <TableCell>{order.timeline || 'N/A'}</TableCell>
                    <TableCell>{order.budget || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="new">New</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminOrderRequests;
