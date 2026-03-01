import { FiX } from 'react-icons/fi';
import { Input, Button } from '../../../../../shared/ui/index.js';

const TagInput = ({ 
	label, 
	emoji,
	items, 
	inputValue, 
	onInputChange, 
	onAdd, 
	onRemove, 
	placeholder,
	error,
	renderTag,
}) => {
	return (
		<div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
			<label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
				{emoji} {label}
				<span className="text-[10px] font-medium text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
					{items.length} added
				</span>
			</label>
			<div className="flex gap-2">
				<Input
					placeholder={placeholder}
					value={inputValue}
					onChange={(e) => onInputChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							onAdd();
						}
					}}
				/>
				<Button type="button" variant="secondary" onClick={onAdd} className="shrink-0 !rounded-xl">
					Add
				</Button>
			</div>
			{error && <p className="text-xs text-rose-500 mt-1.5">{error}</p>}
			{items.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mt-3">
					{items.map((item) => (
						renderTag ? renderTag(item, onRemove) : (
							<span 
								key={item} 
								className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-sm"
							>
								{item}
								<button
									type="button"
									onClick={() => onRemove(item)}
									className="text-gray-400 hover:text-rose-500 transition-colors"
									aria-label={`Remove ${item}`}
								>
									<FiX className="w-3 h-3" />
								</button>
							</span>
						)
					))}
				</div>
			)}
		</div>
	);
};

export default TagInput;
