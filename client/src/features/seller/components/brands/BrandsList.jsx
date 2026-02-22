import BrandCard from './BrandCard.jsx';

const BrandsList = ({ 
	brands, 
	onEdit, 
	onDelete, 
	onLogoEdit, 
	onSelect, 
	selectedBrandId 
}) => (
	<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
		{brands.map((brand) => (
			<BrandCard
				key={brand._id}
				brand={brand}
				onEdit={onEdit}
				onDelete={onDelete}
				onLogoEdit={onLogoEdit}
				onSelect={onSelect}
				isSelected={selectedBrandId === brand._id}
			/>
		))}
	</div>
);

export default BrandsList;
