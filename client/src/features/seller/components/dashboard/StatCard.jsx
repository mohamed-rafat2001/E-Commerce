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
  const FinalIcon = useStatObject ? stat.icon : Icon;
  
  const isPositive = finalChangeType === 'positive';
  const isNeutral = finalChangeType === 'neutral';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index !== undefined) ? index * 0.1 : 0 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${finalGradient} flex items-center justify-center shadow-lg mb-3`}>
          {FinalIcon && <FinalIcon className="w-6 h-6 text-white" />}
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm font-medium">{finalTitle}</p>
          <h3 className="text-3xl font-black text-gray-900 mt-1">{finalValue}</h3>
        </div>
      </div>
      {finalChange && (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
          isPositive 
            ? 'bg-emerald-100 text-emerald-700' 
            : isNeutral 
              ? 'bg-gray-100 text-gray-600'
              : 'bg-rose-100 text-rose-700'
        }`}>
          {isPositive ? '↗' : isNeutral ? '→' : '↘'} {finalChange}
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;