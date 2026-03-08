import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight, FiEdit3, FiMoreHorizontal } from 'react-icons/fi';
import { Button } from '../../../../shared/ui';

const ProductPageHeader = ({
    product,
    basePath,
    onEdit,
    viewerRole = 'seller'
}) => {
    const navigate = useNavigate();
    const isSeller = viewerRole === 'seller';

    return (
        <div className="py-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex flex-col gap-6">
                <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                    <Link to={basePath} className="hover:text-indigo-600 transition-colors">Catalog</Link>
                    <FiChevronRight className="w-3 h-3 opacity-50" />
                    <span className="text-indigo-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                        {product?.name || 'Loading Asset'}
                    </span>
                </nav>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-14 h-14 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm flex items-center justify-center active:scale-90"
                    >
                        <FiArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
                        {product?.name}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isSeller && (
                    <Button
                        variant="primary"
                        onClick={onEdit}
                        className="!rounded-[1.5rem] !px-10 !h-16 font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:!scale-105 active:!scale-95 transition-all"
                    >
                        Modify Asset
                    </Button>
                )}

                <button className="w-16 h-16 rounded-[1.5rem] bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all shadow-sm flex items-center justify-center active:scale-90">
                    <FiMoreHorizontal className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default ProductPageHeader;
