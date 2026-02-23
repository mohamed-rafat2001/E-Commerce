// Mock data for demonstration purposes
const mockOrders = [
  { id: 'ORD-2024-001', date: '2024-01-15', total: 299.99, status: 'Delivered', items: 3 },
  { id: 'ORD-2024-002', date: '2024-01-22', total: 149.50, status: 'Delivered', items: 2 },
  { id: 'ORD-2024-003', date: '2024-02-01', total: 89.99, status: 'Processing', items: 1 },
];

const mockProducts = [
  { id: 1, name: 'Wireless Headphones Pro', price: 149.99, quantity: 1, order: 'ORD-2024-001', image: null },
  { id: 2, name: 'Bluetooth Speaker', price: 79.99, quantity: 1, order: 'ORD-2024-001', image: null },
  { id: 3, name: 'Laptop Stand Premium', price: 49.99, quantity: 1, order: 'ORD-2024-002', image: null },
  { id: 4, name: 'USB-C Hub Pro', price: 39.99, quantity: 1, order: 'ORD-2024-002', image: null },
  { id: 5, name: 'Mechanical Keyboard', price: 89.99, quantity: 1, order: 'ORD-2024-003', image: null },
];

const useUserData = () => {
  return {
    mockOrders,
    mockProducts
  };
};

export default useUserData;