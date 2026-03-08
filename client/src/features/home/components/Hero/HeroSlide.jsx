import React from 'react';
import { motion } from 'framer-motion';
import { Button, Badge, Skeleton } from '../../../../shared/ui';
import { fadeUp } from '../../../../shared/utils/animations';

const HeroSlide = ({ slide }) => {
    const imageUrl = slide.image;

    return (
        <div className="relative h-full w-full flex items-center">
            {/* Background Image Container */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${imageUrl}")` }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="max-w-2xl text-white">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <Badge variant="featured" className="mb-6 uppercase tracking-wider">
                            {slide.badge}
                        </Badge>

                        <motion.h1
                            variants={fadeUp}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black font-display mb-6 leading-[1.1]"
                        >
                            {slide.title}
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-200 mb-10 leading-relaxed font-body"
                        >
                            {slide.description}
                        </motion.p>

                        <motion.div
                            variants={fadeUp}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button variant="premium" size="lg" className="px-10">
                                Shop Now
                            </Button>
                            <Button variant="outline" size="lg" className="px-10 text-white border-white hover:bg-white/10">
                                Sell With Us
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HeroSlide;
