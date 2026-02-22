import StatCard from './StatCard.jsx';

const StatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
        ))}
    </div>
  );
};

export default StatsGrid;
