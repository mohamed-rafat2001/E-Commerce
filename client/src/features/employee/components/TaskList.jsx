import { motion } from 'framer-motion';
import { Card, Badge } from '../../../shared/ui/index.js';

const TaskList = ({ tasks }) => {
	return (
		<motion.div
			className="lg:col-span-2"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<Card variant="elevated">
				<Card.Header>
					<Card.Title>Today's Tasks</Card.Title>
				</Card.Header>
				<Card.Content className="space-y-3">
					{tasks.map((task, index) => (
						<motion.div
							key={task.id}
							className="flex items-center justify-between p-4 rounded-xl 
								bg-gray-50/50 hover:bg-gray-100/50 transition-all cursor-pointer"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 + index * 0.05 }}
							whileHover={{ scale: 1.01 }}
						>
							<div className="flex items-center gap-4">
								<div className={`w-2 h-2 rounded-full ${
									task.priority === 'high' ? 'bg-red-500' : 
									task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
								}`} />
								<span className="font-medium text-gray-900">{task.title}</span>
							</div>
							<Badge variant="soft" color="secondary">
								{task.count}
							</Badge>
						</motion.div>
					))}
				</Card.Content>
			</Card>
		</motion.div>
	);
};

export default TaskList;
