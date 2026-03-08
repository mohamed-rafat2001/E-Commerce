import React from 'react';

const ProductDetailsTab = ({ product, viewerRole }) => {
    const isAdmin = viewerRole === 'admin';
    const formatDate = (date) => date ? new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : '—';

    // Build items only from actual data present in the product object
    const detailItems = [
        { label: 'Category', value: product?.primaryCategory?.name },
        { label: 'Sub-Category', value: product?.subCategory?.name },
        { label: 'Asset Brand', value: product?.brandId?.name },
        { label: 'Status', value: product?.status, uppercase: true },
        { label: 'Visibility', value: product?.visibility, uppercase: true },
        { label: 'Inventory Count', value: product?.countInStock?.toString() },
        { label: 'Creation Date', value: formatDate(product?.createdAt) },
        { label: 'Last Modification', value: formatDate(product?.updatedAt) },
    ];

    if (isAdmin && product?.sellerId?.name) {
        detailItems.push({ label: 'Origin Seller', value: product?.sellerId?.name });
    }

    // Filter out items with no value to avoid showing "constant" empty placeholders
    const activeItems = detailItems.filter(item => item.value);

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {activeItems.map((item, idx) => (
                    <div key={idx} className="p-10 border-b border-r border-gray-50 last:border-b-0 group hover:bg-indigo-50/30 transition-all">
                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3 block group-hover:text-indigo-500 transition-colors">
                            {item.label}
                        </span>
                        <span className={`text-base font-black text-gray-900 leading-tight ${item.uppercase ? 'uppercase' : ''}`}>
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductDetailsTab;
