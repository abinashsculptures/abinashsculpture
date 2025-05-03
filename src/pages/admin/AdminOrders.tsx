
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

interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  product_id: string | null;
  status: string;
  created_at: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching orders',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      ));

      toast({
        title: 'Order updated',
        description: `Order status changed to ${newStatus}`
      });
    } catch (error: any) {
      toast({
        title: 'Error updating order',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  if (loading) {
    return <div className="text-center py-10">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">WhatsApp Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>
                  {order.customer_phone || 'N/A'}
                  <br />
                  <span className="text-xs text-gray-500">{order.customer_email || 'No email'}</span>
                </TableCell>
                <TableCell>
                  <span 
                    className={`px-2 py-1 rounded text-xs ${
                      order.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {order.status === 'new' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                      >
                        Mark Processing
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                      >
                        Mark Completed
                      </Button>
                    )}
                    {order.status !== 'cancelled' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminOrders;
