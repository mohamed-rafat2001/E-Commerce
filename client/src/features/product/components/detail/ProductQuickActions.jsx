import React from 'react';
import { FiEye, FiTrash2, FiEdit3 } from 'react-icons/fi';
import { Button } from '../../../../shared/ui';

const ProductQuickActions = ({
    onViewPublic,
    onDelete,
    viewerRole = 'seller',
    isPending = false
}) => {
    const isSeller = viewerRole === 'seller';
    const isAdmin = viewerRole === 'admin';

    return (
        <div className="flex flex-col gap-4 mt-8">
            <Button
                variant="outline"
                size="lg"
                fullWidth
                icon={<FiEye className="w-5 h-5" />}
                onClick={onViewPublic}
                className="!border-gray-100 !text-gray-900 hover:!bg-gray-50 !rounded-2xl !h-16 font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all"
            >
                Preview Public Page
            </Button>

            {isSeller && (
                <button
                    onClick={onDelete}
                    className="mt-4 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 group"
                >
                    <FiTrash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Permanent Deletion</span>
                </button>
            )}

            {isAdmin && isPending && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <Button variant="success" fullWidth className="!h-14 font-black !rounded-2xl uppercase tracking-widest text-[10px]">Approve</Button>
                    <Button variant="danger" fullWidth className="!h-14 font-black !rounded-2xl uppercase tracking-widest text-[10px]">Reject</Button>
                </div>
            )}
        </div>
    );
};

export default ProductQuickActions;
