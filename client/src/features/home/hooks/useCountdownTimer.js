import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage a countdown timer
 * @param {Date|string|number} endTime 
 */
export const useCountdownTimer = (endTime) => {
    const calculateTimeLeft = useCallback(() => {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                total: difference
            };
        } else {
            timeLeft = { hours: 0, minutes: 0, seconds: 0, total: 0 };
        }

        return timeLeft;
    }, [endTime]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const nextTime = calculateTimeLeft();
            setTimeLeft(nextTime);

            if (nextTime.total <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    return {
        ...timeLeft,
        isEnded: timeLeft.total <= 0
    };
};

export default useCountdownTimer;
