import { useDashboardStats } from './index.js';

const useDashboardPage = () => {
  const { stats, isLoading } = useDashboardStats();

  return {
    stats,
    isLoading
  };
};

export default useDashboardPage;