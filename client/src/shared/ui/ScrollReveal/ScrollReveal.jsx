import React from 'react';
import { motion } from 'framer-motion';

const variants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } }
};

const ScrollReveal = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.5,
    className = ""
}) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay, duration, ease: "easeOut" }}
            variants={variants[direction]}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
