import { useSearchParams } from 'react-router-dom';

export default function useStockFilter(defaultLimit = 6) {
	const [searchParams, setSearchParams] = useSearchParams();
	const stockFilter = searchParams.get('stock') || 'all';

	const setStockFilter = (value) => {
		const newParams = new URLSearchParams(searchParams);
		if (value && value !== 'all') {
			newParams.set('stock', value);
		} else {
			newParams.delete('stock');
		}
		newParams.set('page', '1');
		newParams.set('limit', String(defaultLimit));
		setSearchParams(newParams);
	};

	return { stockFilter, setStockFilter };
}

