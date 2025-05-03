
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

interface OrdersStats {
  total: number;
  new: number;
  processing: number;
  completed: number;
  cancelled: number;
}

interface CategoryStats {
  name: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#B58AAF'];

const AdminAnalytics: React.FC = () => {
  const [ordersStats, setOrdersStats] = useState<OrdersStats>({
    total: 0,
    new: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  });
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch orders stats
      const { data: ordersData, error: ordersError } = await supabase
        .from('whatsapp_orders')
        .select('status');

      if (ordersError) {
        throw ordersError;
      }

      const stats = {
        total: ordersData.length,
        new: ordersData.filter(o => o.status === 'new').length,
        processing: ordersData.filter(o => o.status === 'processing').length,
        completed: ordersData.filter(o => o.status === 'completed').length,
        cancelled: ordersData.filter(o => o.status === 'cancelled').length
      };

      setOrdersStats(stats);
      
      // Fetch products for category stats
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('category');
        
      if (productsError) {
        throw productsError;
      }

      // Count products by category
      const categories: {[key: string]: number} = {};
      productsData.forEach(product => {
        const category = product.category;
        categories[category] = (categories[category] || 0) + 1;
      });

      const categoryStatsData = Object.entries(categories).map(([name, count]) => ({
        name,
        count
      }));

      setCategoryStats(categoryStatsData);
    } catch (error: any) {
      toast({
        title: 'Error fetching analytics',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const orderStatusData = [
    { name: 'New', value: ordersStats.new },
    { name: 'Processing', value: ordersStats.processing },
    { name: 'Completed', value: ordersStats.completed },
    { name: 'Cancelled', value: ordersStats.cancelled }
  ];

  if (loading) {
    return <div className="text-center py-10">Loading analytics...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold">{ordersStats.total}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <p className="text-sm text-blue-600">New Orders</p>
          <p className="text-3xl font-bold text-blue-600">{ordersStats.new}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-sm text-yellow-600">Processing</p>
          <p className="text-3xl font-bold text-yellow-600">{ordersStats.processing}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-3xl font-bold text-green-600">{ordersStats.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Order Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
