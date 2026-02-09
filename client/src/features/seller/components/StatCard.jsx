import { motion } from 'framer-motion';

const StatCard = ({ stat, index }) => {
  const { title, value, change, changeType, icon: Icon, gradient } = stat;
  const isPositive = changeType === 'positive';
  const isNeutral = changeType === 'neutral';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className={`text-sm ${isPositive ? 'text-emerald-600' : isNeutral ? 'text-gray-600' : 'text-rose-600'}`}>
        {change}
      </div>
    </motion.div>
  );
};

export default StatCard;