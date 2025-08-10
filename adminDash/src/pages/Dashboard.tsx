import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, Package, AlertTriangle, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '../components/UI/Card';
import { useApi } from '../hooks/useApi';
import { analyticsService, apiUtils } from '../services/api';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}> = ({ title, value, icon, trend, color }) => (
  <Card hover className="relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-10 rounded-full -mr-8 -mt-8`} />
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[#c4c4c4] text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-green-400 text-sm">+{trend}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { data: stats, loading: statsLoading, error: statsError } = useApi(
    () => analyticsService.getDashboardStats(),
    []
  );

  const { data: revenueData, loading: revenueLoading } = useApi(
    () => analyticsService.getRevenueData('month'),
    []
  );
/*
  // Use real data or fallback to mock data
  const revenueData = [
    { name: 'Jan', revenue: 12000 },
    { name: 'Feb', revenue: 15000 },
    { name: 'Mar', revenue: 13500 },
    { name: 'Apr', revenue: 16800 },
    { name: 'May', revenue: 14200 },
    { name: 'Jun', revenue: 18500 }
  ];
*/
  const orderStatusData = [
    { name: 'Delivered', value: stats?.completedOrders || 0, fill: '#10b981' },
    { name: 'Processing', value: stats?.pendingOrders || 0, fill: '#f59e0b' },
    { name: 'Cancelled', value: stats?.cancelledOrders || 0, fill: '#ef4444' }
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5100] mx-auto mb-4"></div>
          <p className="text-[#c4c4c4]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Failed to load dashboard</p>
          <p className="text-[#c4c4c4] text-sm">{statsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-[#c4c4c4] mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          trend={(stats?.totalOrders ?? 0)> 0 ? 8 : undefined}
          color="bg-gradient-to-br from-[#ff5100] to-[#e64400]"
        />
        <StatCard
          title="Total Revenue"
          value={apiUtils.formatCurrency(stats?.totalRevenue || 0, 'DZD')}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          trend={(stats?.totalRevenue ?? 0) > 0 ? 12 : undefined}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || 0}
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Guest Orders"
          value={stats?.guestOrders || 0}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-white mb-4">Revenue Trend</h3>
            {revenueLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5100]"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3f45" />
                <XAxis dataKey="name" stroke="#c4c4c4" />
                <YAxis stroke="#c4c4c4" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2a2f35', 
                    border: '1px solid #3a3f45',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Bar dataKey="revenue" fill="url(#gradient)" />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff5100" />
                    <stop offset="100%" stopColor="#e64400" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-white mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#2a2f35', 
                    border: '1px solid #3a3f45',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4 space-x-4">
              {orderStatusData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-[#c4c4c4] text-sm">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-[#1b1f24] rounded-lg hover:bg-[#3a3f45] transition-colors text-left">
              <ShoppingCart className="w-8 h-8 text-[#ff5100] mb-2" />
              <h4 className="text-white font-medium">View Orders</h4>
              <p className="text-[#c4c4c4] text-sm">Manage customer orders</p>
            </button>
            <button className="p-4 bg-[#1b1f24] rounded-lg hover:bg-[#3a3f45] transition-colors text-left">
              <Package className="w-8 h-8 text-[#ff5100] mb-2" />
              <h4 className="text-white font-medium">Manage Inventory</h4>
              <p className="text-[#c4c4c4] text-sm">Add or update games</p>
            </button>
            <button className="p-4 bg-[#1b1f24] rounded-lg hover:bg-[#3a3f45] transition-colors text-left">
              <TrendingUp className="w-8 h-8 text-[#ff5100] mb-2" />
              <h4 className="text-white font-medium">View Analytics</h4>
              <p className="text-[#c4c4c4] text-sm">Track performance</p>
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};