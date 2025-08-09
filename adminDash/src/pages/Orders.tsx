import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { StatusBadge } from '../components/UI/StatusBadge';
import { usePaginatedApi, useApiMutation } from '../hooks/useApi';
import { ordersService, apiUtils, type Order } from '../services/api';

export const Orders: React.FC = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    paymentStatus: 'all',
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const {
    data: orders,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    refetch
  } = usePaginatedApi(
    (page, limit) => ordersService.getAll({
      page,
      limit,
      status: filters.status !== 'all' ? filters.status : undefined,
      paymentStatus: filters.paymentStatus !== 'all' ? filters.paymentStatus : undefined,
      email: filters.search || undefined,
    }),
    1,
    10,
    filters
  );

  const { mutate: updateOrderStatus, loading: updating } = useApiMutation();

  const handleStatusUpdate = async (orderNumber: string, newStatus: Order['status']) => {
    const result = await updateOrderStatus(
      (params: { orderNumber: string; status: Order['status'] }) => 
        ordersService.updateStatus(params.orderNumber, params.status),
      { orderNumber, status: newStatus }
    );
    
    if (result) {
      refetch();
      if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading && !orders.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ff5100] animate-spin mx-auto mb-4" />
          <p className="text-[#c4c4c4]">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error && !orders.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Failed to load orders</p>
          <p className="text-[#c4c4c4] text-sm">{error}</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
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
          <h1 className="text-3xl font-bold text-white">Order Management</h1>
          <p className="text-[#c4c4c4] mt-1">Track and manage customer orders</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-[#c4c4c4] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#c4c4c4]" />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="bg-[#1b1f24] border border-[#3a3f45] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff5100] transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                className="bg-[#1b1f24] border border-[#3a3f45] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#ff5100] transition-colors"
              >
                <option value="all">All Payment Status</option>
                <option value="pending">Payment Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3a3f45]">
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Payment</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-[#3a3f45]/50 hover:bg-[#3a3f45]/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-white font-mono">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{order.customer.fullName}</p>
                        <p className="text-[#c4c4c4] text-sm">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.customer.isGuest 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {order.customer.isGuest ? 'Guest' : 'Registered'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold">
                      {apiUtils.formatCurrency(order.totalAmount, order.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="py-3 px-4 text-[#c4c4c4]">
                      {apiUtils.formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.orderNumber, 'confirmed')}
                            disabled={updating}
                            className="text-xs"
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#3a3f45]">
            <p className="text-[#c4c4c4] text-sm">
              Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, orders.length)} orders
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-white px-3 py-1 bg-[#3a3f45] rounded">
                {currentPage} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#2a2f35] border border-[#3a3f45] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Order {selectedOrder.orderNumber}</h2>
              <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Customer Details</h3>
                  <p className="text-[#c4c4c4]">Name: {selectedOrder.customer.fullName}</p>
                  <p className="text-[#c4c4c4]">Email: {selectedOrder.customer.email}</p>
                  <p className="text-[#c4c4c4]">Phone: {selectedOrder.customer.phoneNumber || 'N/A'}</p>
                  <p className="text-[#c4c4c4]">Wilaya: {selectedOrder.customer.wilayaName}</p>
                  <p className="text-[#c4c4c4]">Type: {selectedOrder.customer.isGuest ? 'Guest' : 'Registered'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Order Details</h3>
                  <p className="text-[#c4c4c4]">Date: {apiUtils.formatDate(selectedOrder.createdAt)}</p>
                  <p className="text-[#c4c4c4] flex items-center gap-2">
                    Status: <StatusBadge status={selectedOrder.status} />
                  </p>
                  <p className="text-[#c4c4c4] flex items-center gap-2">
                    Payment: <StatusBadge status={selectedOrder.paymentStatus} />
                  </p>
                  <p className="text-[#c4c4c4]">
                    Total: {apiUtils.formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.gameId} className="flex justify-between items-center p-3 bg-[#1b1f24] rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-[#c4c4c4] text-sm">Platform: {item.platform}</p>
                        <p className="text-[#c4c4c4] text-sm">Quantity: {item.quantity}</p>
                        {item.discount > 0 && (
                          <p className="text-green-400 text-sm">Discount: {item.discount}%</p>
                        )}
                      </div>
                      <p className="text-white font-semibold">${item.price}</p>
                        <p className="text-white font-semibold">
                          {apiUtils.formatCurrency(item.discountedPrice * item.quantity)}
                        </p>
                        {item.discount > 0 && (
                          <p className="text-[#c4c4c4] text-sm line-through">
                            {apiUtils.formatCurrency(item.originalPrice * item.quantity)}
                          </p>
                        )}
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#3a3f45]">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#c4c4c4]">Subtotal:</span>
                      <span className="text-white">{apiUtils.formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.totalDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#c4c4c4]">Discount:</span>
                        <span className="text-green-400">-{apiUtils.formatCurrency(selectedOrder.totalDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-white">Total:</span>
                      <span className="text-[#ff5100]">{apiUtils.formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="mt-6 pt-4 border-t border-[#3a3f45]">
                  <h4 className="text-white font-medium mb-3">Order Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(selectedOrder.orderNumber, 'confirmed')}
                        disabled={updating}
                      >
                        Confirm Order
                      </Button>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(selectedOrder.orderNumber, 'processing')}
                        disabled={updating}
                      >
                        Start Processing
                      </Button>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(selectedOrder.orderNumber, 'delivered')}
                        disabled={updating}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                    {['pending', 'confirmed'].includes(selectedOrder.status) && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleStatusUpdate(selectedOrder.orderNumber, 'cancelled')}
                        disabled={updating}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};