export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};

export const fadeDown = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 }
};

export const fadeLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 }
};

export const fadeRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 }
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 }
};

export const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
};

export const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.03, y: -6 }
};

export const buttonHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.97 }
};
