const SummaryItem = ({ label, value }) => (
	<div className="space-y-0.5">
		<p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
		<p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
	</div>
);

export default SummaryItem;
