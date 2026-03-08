import React from 'react';
import { FiStar } from 'react-icons/fi';

const TestimonialCard = ({ reviewer }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-1 text-amber-500 mb-6">
                {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-current" />
                ))}
            </div>

            <p className="text-gray-600 text-lg italic mb-8 flex-1 leading-relaxed">
                "{reviewer.comment}"
            </p>

            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl overflow-hidden">
                    {reviewer.avatar ? (
                        <img src={reviewer.avatar} alt={reviewer.name} className="w-full h-full object-cover" />
                    ) : (
                        reviewer.name.charAt(0)
                    )}
                </div>
                <div>
                    <h4 className="font-black text-gray-900">{reviewer.name}</h4>
                    <p className="text-sm text-gray-400 font-medium">Verified Shopper</p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
