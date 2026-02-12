import { useState } from 'react';
import { useAdminAnalytics } from './index.js';

const useAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('7d');
  
  const { 
    stats, 
    revenueData, 
    topProducts, 
    topSellers, 
    userGrowthData, 
    isLoading 
  } = useAdminAnalytics(dateRange);

  return {
    // State
    dateRange,
    setDateRange,
    
    // Data
    stats,
    revenueData,
    topProducts,
    topSellers,
    userGrowthData,
    isLoading
  };
};

export default useAnalyticsPage;