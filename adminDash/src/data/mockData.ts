import { Order, Product, DashboardStats, HomepageContent } from '../types';

export const mockOrders: Order[] = [
  {
    id: '1',
    customer: 'John Doe',
    email: 'john@example.com',
    total: 89.99,
    status: 'completed',
    date: '2024-01-15',
    items: [
      { id: '1', name: 'Cyberpunk 2077', price: 59.99, quantity: 1, type: 'game' },
      { id: '2', name: 'Gaming Mouse Pad', price: 29.99, quantity: 1, type: 'merchandise' }
    ]
  },
  {
    id: '2',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    total: 124.97,
    status: 'processing',
    date: '2024-01-15',
    items: [
      { id: '3', name: 'FIFA 24', price: 69.99, quantity: 1, type: 'game' },
      { id: '4', name: 'Call of Duty: MW3', price: 54.98, quantity: 1, type: 'game' }
    ]
  },
  {
    id: '3',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    total: 39.99,
    status: 'pending',
    date: '2024-01-14',
    items: [
      { id: '5', name: 'Gaming Headset', price: 39.99, quantity: 1, type: 'merchandise' }
    ]
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    category: 'RPG',
    platform: 'PC',
    price: 59.99,
    quantity: 25,
    status: 'in_stock',
    type: 'game',
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg'
  },
  {
    id: '2',
    title: 'FIFA 24',
    category: 'Sports',
    platform: 'Multi',
    price: 69.99,
    quantity: 5,
    status: 'low_stock',
    type: 'game',
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg'
  },
  {
    id: '3',
    title: 'Gaming Mouse Pad XXL',
    category: 'Accessories',
    price: 29.99,
    quantity: 0,
    status: 'out_of_stock',
    type: 'merchandise',
    image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg'
  },
  {
    id: '4',
    title: 'RGB Mechanical Keyboard',
    category: 'Peripherals',
    price: 129.99,
    quantity: 15,
    status: 'in_stock',
    type: 'merchandise',
    image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg'
  }
];

export const mockStats: DashboardStats = {
  ordersToday: 12,
  totalRevenue: 15420.50,
  lowStockAlerts: 3,
  totalProducts: 156
};

export const mockHomepageContent: HomepageContent = {
  heroBanner: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
  categories: {
    xbox: true,
    playstation: true,
    pc: true,
    merchandise: true
  },
  carousel: [
    {
      id: '1',
      title: 'New Release: Cyberpunk 2077',
      image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
      link: '/products/cyberpunk-2077',
      active: true
    },
    {
      id: '2',
      title: 'FIFA 24 - Now Available',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      link: '/products/fifa-24',
      active: true
    }
  ]
};

export const revenueData = [
  { name: 'Jan', revenue: 12000 },
  { name: 'Feb', revenue: 15000 },
  { name: 'Mar', revenue: 13500 },
  { name: 'Apr', revenue: 16800 },
  { name: 'May', revenue: 14200 },
  { name: 'Jun', revenue: 18500 }
];

export const orderStatusData = [
  { name: 'Completed', value: 65, fill: '#ff5100' },
  { name: 'Processing', value: 25, fill: '#e64400' },
  { name: 'Pending', value: 10, fill: '#c4c4c4' }
];