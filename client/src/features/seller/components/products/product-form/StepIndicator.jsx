import { FiCheck } from 'react-icons/fi';

const StepIndicator = ({ steps, currentStep, onStepClick, validateCurrentStep }) => {
	const getStepStatus = (stepIndex) => {
		if (stepIndex < currentStep) return 'completed';
		if (stepIndex === currentStep) return 'current';
		return 'upcoming';
	};

	return (
		<div className="flex items-center gap-1">
			{steps.map((step, index) => {
				const status = getStepStatus(index);
				const StepIcon = step.icon;
				return (
					<div key={step.id} className="flex items-center flex-1">
						<button
							onClick={() => {
								if (index < currentStep || validateCurrentStep()) {
									onStepClick(index);
								}
							}}
							className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 w-full ${
								status === 'current'
									? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
									: status === 'completed'
										? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
										: 'text-gray-400 hover:bg-gray-50 border border-transparent'
							}`}
						>
							<div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
								status === 'current'
									? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
									: status === 'completed'
										? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
										: 'bg-gray-200 text-gray-400'
							}`}>
								{status === 'completed' ? (
									<FiCheck className="w-3.5 h-3.5" />
								) : (
									<StepIcon className="w-3.5 h-3.5" />
								)}
							</div>
							<span className="text-xs font-bold hidden sm:block truncate">{step.label}</span>
						</button>
						{index < steps.length - 1 && (
							<div className={`w-4 h-0.5 shrink-0 mx-0.5 rounded-full transition-colors ${
								index < currentStep ? 'bg-emerald-300' : 'bg-gray-200'
							}`} />
						)}
					</div>
				);
			})}
		</div>
	);
};

export default StepIndicator;
