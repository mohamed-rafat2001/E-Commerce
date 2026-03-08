import React from 'react';
import ProductPriceDisplay from './ProductPriceDisplay';
import ProductStatusBadges from './ProductStatusBadges';
import ProductStockIndicator from './ProductStockIndicator';
import ProductQuickActions from './ProductQuickActions';

const ProductInfoCard = ({
    product,
    onEdit,
    onViewPublic,
    onDelete,
    viewerRole
}) => {
    return (
        <div className="h-full bg-white rounded-[3rem] p-10 xl:p-14 border border-blue-50/50 shadow-2xl shadow-indigo-500/5 flex flex-col justify-between">
            <div className="space-y-10">
                <div className="space-y-6">
                    <ProductStatusBadges
                        status={product?.status}
                        visibility={product?.visibility}
                    />

                    <h2 className="text-3xl xl:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                        {product?.name}
                    </h2>

                    <div className="flex flex-col gap-1.5 border-l-2 border-indigo-500 pl-4 py-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand Lineage</span>
                        <span className="text-lg font-black text-gray-900">{product?.brandId?.name || 'Authorized Proprietary'}</span>
                    </div>
                </div>

                <div className="space-y-12">
                    <ProductPriceDisplay
                        price={product?.price}
                        discount={product?.discount}
                    />

                    <ProductStockIndicator stock={product?.countInStock} />
                </div>
            </div>

            <ProductQuickActions
                onEdit={onEdit}
                onViewPublic={onViewPublic}
                onDelete={onDelete}
                viewerRole={viewerRole}
            />
        </div>
    );
};

export default ProductInfoCard;
