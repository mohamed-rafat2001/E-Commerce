import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCountdownTimer from '../../hooks/useCountdownTimer';

const TimeBlock = ({ value, label }) => {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-gray-900 rounded-xl md:rounded-2xl border border-white/10 shadow-lg shadow-black/50 overflow-hidden">
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="text-2xl md:text-3xl font-black text-white font-mono"
                    >
                        {String(value).padStart(2, '0')}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
    );
};

const CountdownTimer = ({ endTime, onEnd }) => {
    const timeLeft = useCountdownTimer(endTime);

    React.useEffect(() => {
        if (timeLeft.isEnded && onEnd) {
            onEnd();
        }
    }, [timeLeft.isEnded, onEnd]);

    return (
        <div className="flex items-center gap-3 md:gap-4">
            <TimeBlock value={timeLeft.hours} label="Hrs" />
            <span className="text-xl md:text-2xl font-black text-indigo-500 mb-6">:</span>
            <TimeBlock value={timeLeft.minutes} label="Min" />
            <span className="text-xl md:text-2xl font-black text-indigo-500 mb-6">:</span>
            <TimeBlock value={timeLeft.seconds} label="Sec" />
        </div>
    );
};

export default CountdownTimer;
