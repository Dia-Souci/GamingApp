import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { StatusBadge } from '../components/UI/StatusBadge';
import { usePaginatedApi, useApiMutation } from '../hooks/useApi';
import { ordersService, paymentService, apiUtils, type Order, type PaymentInfo } from '../services/api';

// Separate modal component to prevent recreation
const OrderDetailsModal: React.FC<{ 
  order: Order; 
  onClose: () => void;
  onUpdateStatus: (orderNumber: string, status: Order['status'], paymentStatus?: Order['paymentStatus']) => Promise<Order | null>;
}> = ({ order, onClose, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState<Order['status']>(order.status);
  const [newPaymentStatus, setNewPaymentStatus] = useState<Order['paymentStatus']>(order.paymentStatus);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number | undefined>();
  const [processingRefund, setProcessingRefund] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [assigningKeys, setAssigningKeys] = useState(false);

  // Reset form when order changes - use useCallback to prevent recreation
  const resetForm = useCallback(() => {
    setNewStatus(order.status);
    setNewPaymentStatus(order.paymentStatus);
    setNote('');
  }, [order.status, order.paymentStatus]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  // Load payment information when order changes
  useEffect(() => {
    const loadPaymentInfo = async () => {
      if (order.paymentStatus === 'paid' || order.paymentStatus === 'refunded') {
        setLoadingPaymentInfo(true);
        try {
          const info = await paymentService.getPaymentInfo(order.orderNumber);
          setPaymentInfo(info);
        } catch (error) {
          console.error('Failed to load payment info:', error);
        } finally {
          setLoadingPaymentInfo(false);
        }
      }
    };

    loadPaymentInfo();
  }, [order.orderNumber, order.paymentStatus]);

  const handleRefund = async () => {
    if (!paymentInfo?.transactionId) return;
    
    try {
      setProcessingRefund(true);
      await paymentService.processRefund(paymentInfo.transactionId, refundAmount);
      // Refresh payment info after refund
      const info = await paymentService.getPaymentInfo(order.orderNumber);
      setPaymentInfo(info);
      setRefundAmount(undefined);
    } catch (error) {
      console.error('Failed to process refund:', error);
    } finally {
      setProcessingRefund(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setConfirmingPayment(true);
      await ordersService.confirmPayment(order.orderNumber);
      // Refresh the order data
      const updatedOrder = await ordersService.getOne(order.orderNumber);
      onUpdateStatus(order.orderNumber, updatedOrder.status, updatedOrder.paymentStatus);
    } catch (error) {
      console.error('Failed to confirm payment:', error);
    } finally {
      setConfirmingPayment(false);
    }
  };

  const handleAssignKeysAndDeliver = async () => {
    try {
      setAssigningKeys(true);
      await ordersService.assignActivationKeysAndDeliver(order.orderNumber);
      // Refresh the order data
      const updatedOrder = await ordersService.getOne(order.orderNumber);
      onUpdateStatus(order.orderNumber, updatedOrder.status, updatedOrder.paymentStatus);
    } catch (error) {
      console.error('Failed to assign keys and deliver:', error);
    } finally {
      setAssigningKeys(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      if (newStatus !== order.status || newPaymentStatus !== order.paymentStatus) {
        // Call the parent's update function
        await onUpdateStatus(order.orderNumber, newStatus, newPaymentStatus);
      }
      onClose();
    } catch (error) {
      console.error('Failed to update order:', error);
      // Don't close on error, let user see the error
    } finally {
      setUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#2a2f35] border border-[#3a3f45] rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Order Details</h2>
            <p className="text-[#c4c4c4]">Order #{order.orderNumber}</p>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <div className="bg-[#1b1f24] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#c4c4c4]">Order Number:</span>
                  <span className="text-white font-mono">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c4c4c4]">Date:</span>
                  <span className="text-white">{apiUtils.formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c4c4c4]">Total Amount:</span>
                  <span className="text-white font-bold">{apiUtils.formatCurrency(order.totalAmount, order.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c4c4c4]">Source:</span>
                  <span className="text-white capitalize">{order.source || 'web'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c4c4c4]">Guest Order:</span>
                  <span className="text-white">{order.customer.isGuest ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1b1f24] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#c4c4c4]">Name:</span>
                  <span className="text-white">{order.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#c4c4c4]">Email:</span>
                  <span className="text-white">{order.customer.email}</span>
                </div>
                {order.customer.phoneNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#c4c4c4]">Phone:</span>
                    <span className="text-white">{order.customer.phoneNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#c4c4c4]">Wilaya:</span>
                  <span className="text-white">{order.customer.wilayaName} ({order.customer.wilaya})</span>
                </div>
                {order.customer.extraInfo && (
                  <div className="mt-3">
                    <span className="text-[#c4c4c4] block mb-1">Additional Info:</span>
                    <p className="text-white text-xs bg-[#2a2f35] p-2 rounded">{order.customer.extraInfo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            {(order.paymentStatus === 'paid' || order.paymentStatus === 'refunded') && (
              <div className="bg-[#1b1f24] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Payment Information</h3>
                {loadingPaymentInfo ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-[#ff5100]" />
                    <span className="ml-2 text-[#c4c4c4]">Loading payment info...</span>
                  </div>
                ) : paymentInfo ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#c4c4c4]">Payment Method:</span>
                      <span className="text-white capitalize">{paymentInfo.paymentGateway}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#c4c4c4]">Transaction ID:</span>
                      <span className="text-white font-mono text-xs">{paymentInfo.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#c4c4c4]">Paid At:</span>
                      <span className="text-white">{apiUtils.formatDate(paymentInfo.paidAt)}</span>
                    </div>
                    
                    {/* Refund Section */}
                    {order.paymentStatus === 'paid' && (
                      <div className="mt-4 pt-3 border-t border-[#3a3f45]">
                        <h4 className="text-md font-semibold text-white mb-2">Process Refund</h4>
                        <div className="space-y-2">
                          <input
                            type="number"
                            placeholder="Refund amount (leave empty for full refund)"
                            value={refundAmount || ''}
                            onChange={(e) => setRefundAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="w-full px-3 py-2 bg-[#2a2f35] border border-[#3a3f45] rounded text-white text-sm"
                          />
                          <Button
                            onClick={handleRefund}
                            disabled={processingRefund}
                            variant="danger"
                            className="w-full"
                          >
                            {processingRefund ? 'Processing...' : 'Process Refund'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[#c4c4c4] text-sm">No payment information available</p>
                )}
              </div>
            )}

            {/* Status Update */}
            <div className="bg-[#1b1f24] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Update Status</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#c4c4c4] mb-1">Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                    className="w-full px-3 py-2 bg-[#2a2f35] border border-[#3a3f45] rounded text-white text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#c4c4c4] mb-1">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as Order['paymentStatus'])}
                    className="w-full px-3 py-2 bg-[#2a2f35] border border-[#3a3f45] rounded text-white text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#c4c4c4] mb-1">Note (Optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2a2f35] border border-[#3a3f45] rounded text-white text-sm resize-none"
                    rows={2}
                    placeholder="Add a note about this status change..."
                  />
                </div>
                <Button
                  onClick={handleUpdate}
                  disabled={updating || (newStatus === order.status && newPaymentStatus === order.paymentStatus)}
                  className="w-full"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>

            {/* Manual Flow Completion (Development/Testing) */}
            <div className="bg-[#1b1f24] rounded-lg p-4 border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-white mb-3">Manual Flow Completion</h3>
              <p className="text-[#c4c4c4] text-sm mb-4">
                Use these buttons to manually complete the payment flow for testing purposes.
              </p>
              
              <div className="space-y-3">
                {/* Confirm Payment Button */}
                {order.paymentStatus !== 'paid' && (
                  <Button
                    onClick={handleConfirmPayment}
                    disabled={confirmingPayment}
                    variant="secondary"
                    className="w-full"
                  >
                    {confirmingPayment ? 'Confirming...' : 'Confirm Payment (Manual)'}
                  </Button>
                )}

                {/* Assign Keys and Deliver Button */}
                {order.paymentStatus === 'paid' && order.status !== 'delivered' && (
                  <Button
                    onClick={handleAssignKeysAndDeliver}
                    disabled={assigningKeys}
                    variant="primary"
                    className="w-full"
                  >
                    {assigningKeys ? 'Processing...' : 'Assign Keys & Deliver'}
                  </Button>
                )}

                {/* Status indicators */}
                {order.paymentStatus === 'paid' && (
                  <div className="text-green-400 text-sm text-center">
                    ✓ Payment Confirmed
                  </div>
                )}
                
                {order.status === 'delivered' && (
                  <div className="text-green-400 text-sm text-center">
                    ✓ Order Delivered with Keys
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items and Timeline */}
          <div className="space-y-4">
            <div className="bg-[#1b1f24] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-[#2a2f35] rounded">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{item.title}</h4>
                      <p className="text-[#c4c4c4] text-xs">{item.platform}</p>
                      <p className="text-[#c4c4c4] text-xs">Qty: {item.quantity}</p>
                      {item.keyDelivered && (
                        <p className="text-green-400 text-xs">✓ Key Delivered</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium text-sm">
                        {apiUtils.formatCurrency(item.discountedPrice * item.quantity)}
                      </p>
                      {item.discount > 0 && (
                        <p className="text-[#c4c4c4] text-xs line-through">
                          {apiUtils.formatCurrency(item.originalPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-[#3a3f45]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#c4c4c4]">Subtotal:</span>
                  <span className="text-white">{apiUtils.formatCurrency(order.subtotal)}</span>
                </div>
                {order.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#c4c4c4]">Discount:</span>
                    <span className="text-green-400">-{apiUtils.formatCurrency(order.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-white">{apiUtils.formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="bg-[#1b1f24] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#ff5100] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <StatusBadge status={event.status as Order['status']} />
                          <span className="text-[#c4c4c4] text-xs">
                            {apiUtils.formatDate(event.timestamp)}
                          </span>
                        </div>
                        {event.note && (
                          <p className="text-[#c4c4c4] text-sm mt-1">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [guestFilter, setGuestFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [downloadingOrder, setDownloadingOrder] = useState<string | null>(null);

  // Memoize the API call function to prevent recreation on every render
  const apiCall = useCallback((page: number, limit: number) => 
    ordersService.getAll({
      page,
      limit,
      email: searchTerm || undefined,
      status: statusFilter || undefined,
      paymentStatus: paymentFilter || undefined,
      isGuest: guestFilter ? guestFilter === 'true' : undefined,
    }), [searchTerm, statusFilter, paymentFilter, guestFilter]);

  // Memoize the filters object to prevent recreation on every render
  const filters = useMemo(() => ({
    searchTerm,
    statusFilter,
    paymentFilter,
    guestFilter
  }), [searchTerm, statusFilter, paymentFilter, guestFilter]);

  const {
    data: orders,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    refetch
  } = usePaginatedApi(apiCall, 1, 20, filters);

  const { mutate: updateOrderStatus, loading: updating } = useApiMutation();

  const handleStatusUpdate = async (orderNumber: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): Promise<Order | null> => {
    const result = await updateOrderStatus(
      ((params: unknown) => {
        const typedParams = params as { orderNumber: string; status: Order['status']; paymentStatus?: Order['paymentStatus']; note: string };
        return ordersService.updateStatus(typedParams.orderNumber, typedParams.status, typedParams.paymentStatus, typedParams.note);
      }) as (params: unknown) => Promise<Order>,
      { orderNumber, status, paymentStatus, note: `Status updated to ${status}` } as unknown
    );
    
    if (result) {
      refetch();
      if (selectedOrder && selectedOrder.orderNumber === orderNumber) {
        setSelectedOrder(result as Order);
      }
      return result as Order;
    }
    return null;
  };

  const handleDownload = async (order: Order) => {
    if (downloadingOrder === order._id) return; // Prevent multiple downloads
    
    try {
      setDownloadingOrder(order._id);
      
      // First update the status to delivered
      await handleStatusUpdate(order.orderNumber, 'delivered');
      
      // Then generate and download the receipt
      const receiptData = {
        orderNumber: order.orderNumber,
        customerName: order.customer.fullName,
        customerEmail: order.customer.email,
        date: order.createdAt,
        items: order.items,
        totalAmount: order.totalAmount,
        currency: order.currency,
        status: 'delivered'
      };

      // Create receipt content
      const receiptContent = `
        RECEIPT
        ========
        Order #: ${receiptData.orderNumber}
        Date: ${apiUtils.formatDate(receiptData.date)}
        Customer: ${receiptData.customerName}
        Email: ${receiptData.customerEmail}
        
        ITEMS:
        ${receiptData.items.map(item => 
          `${item.title} (${item.platform}) - Qty: ${item.quantity} - ${apiUtils.formatCurrency(item.discountedPrice * item.quantity)}`
        ).join('\n')}
        
        Total: ${apiUtils.formatCurrency(receiptData.totalAmount, receiptData.currency)}
        Status: ${receiptData.status}
        
        Thank you for your purchase!
      `;

      // Create and download file
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${order.orderNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadingOrder(null);
    }
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
          <h1 className="text-3xl font-bold text-white">Orders Management</h1>
          <p className="text-[#c4c4c4] mt-1">Manage customer orders and track deliveries</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-[#c4c4c4] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white focus:outline-none focus:border-[#ff5100] transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white focus:outline-none focus:border-[#ff5100] transition-colors"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={guestFilter}
              onChange={(e) => setGuestFilter(e.target.value)}
              className="px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white focus:outline-none focus:border-[#ff5100] transition-colors"
            >
              <option value="">All Orders</option>
              <option value="true">Guest Orders</option>
              <option value="false">Registered Users</option>
            </select>
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
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Order #</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Payment</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-[#c4c4c4] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-[#3a3f45] hover:bg-[#1b1f24] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-white font-mono text-sm">{order.orderNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white text-sm">{order.customer.fullName}</p>
                        <p className="text-[#c4c4c4] text-xs">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white text-sm">{apiUtils.formatDate(order.createdAt)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium">{apiUtils.formatCurrency(order.totalAmount, order.currency)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.customer.isGuest 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {order.customer.isGuest ? 'Guest' : 'Registered'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(order)}
                          disabled={updating || order.status === 'delivered' || downloadingOrder === order._id}
                        >
                          {downloadingOrder === order._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-[#3a3f45]">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-white px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {orders.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-[#c4c4c4] text-lg">No orders found</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowOrderDetails(false);
              setSelectedOrder(null);
            }}
            onUpdateStatus={handleStatusUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};