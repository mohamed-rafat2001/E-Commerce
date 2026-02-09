export const statusConfig = {
	active: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', dot: 'bg-emerald-500', label: 'Active' },
	draft: { color: 'bg-amber-50 text-amber-600 border-amber-100', dot: 'bg-amber-500', label: 'Draft' },
	inactive: { color: 'bg-slate-50 text-slate-500 border-slate-200', dot: 'bg-slate-400', label: 'Inactive' },
	archived: { color: 'bg-indigo-50 text-indigo-600 border-indigo-100', dot: 'bg-indigo-500', label: 'Archived' },
};

export const statusOptions = [
	{ value: 'active', label: 'Active' },
	{ value: 'draft', label: 'Draft' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'archived', label: 'Archived' },
];

export const ITEMS_PER_PAGE = 10;
