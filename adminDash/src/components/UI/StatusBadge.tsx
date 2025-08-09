import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled' | 'refunded' | 'active' | 'inactive' | 'out_of_stock' | 'paid' | 'failed';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'active':
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
      case 'refunded':
      case 'inactive':
      case 'out_of_stock':
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {getStatusText(status)}
    </span>
  );
};