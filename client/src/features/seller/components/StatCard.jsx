import { motion } from 'framer-motion';

const StatCard = ({ stat, index, title, value, change, changeType, icon: Icon, gradient, color }) => {
  // Determine which interface is being used
  const useStatObject = !!stat;
  
  // Use values from stat object if provided, otherwise use direct props
  const finalTitle = useStatObject ? stat.title : title;
  const finalValue = useStatObject ? stat.value : value;
  const finalChange = useStatObject ? stat.change : change;
  const finalChangeType = useStatObject ? stat.changeType : changeType;
  const finalGradient = useStatObject ? stat.gradient : gradient || color;
  const finalIcon = useStatObject ? stat.icon : Icon;
  
  const isPositive = finalChangeType === 'positive';
  const isNeutral = finalChangeType === 'neutral';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index !== undefined) ? index * 0.1 : 0 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-gray-500 text-sm font-medium">{finalTitle}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{finalValue}</h3>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${finalGradient} flex items-center justify-center`}>
          {finalIcon && <finalIcon className="w-5 h-5 text-white" />}
        </div>
      </div>
      {finalChange && (
        <div className={`text-sm ${isPositive ? 'text-emerald-600' : isNeutral ? 'text-gray-600' : 'text-rose-600'}`}>
          {finalChange}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;