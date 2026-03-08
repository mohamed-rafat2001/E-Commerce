import React from 'react';

const Skeleton = ({ variant = 'text', count = 1, className = "" }) => {
    const styles = {
        text: "h-4 w-full rounded",
        card: "h-40 w-full rounded-2xl",
        "table-row": "h-12 w-full rounded-xl",
        avatar: "h-10 w-10 rounded-full",
        image: "h-48 w-full rounded-xl"
    };

    const skeletons = Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`bg-gray-200 animate-pulse ${styles[variant]} ${className}`} />
    ));

    return count === 1 ? skeletons[0] : <div className="space-y-3">{skeletons}</div>;
};

export default Skeleton;
