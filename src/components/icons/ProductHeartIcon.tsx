"use client";
import type { Variants } from "motion/react";

import { motion, useAnimation } from "motion/react";
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
} from "react";
import type { MouseEvent } from "react";
import { cn } from "../../../lib/utils";
import type { HTMLMotionProps } from "motion/react";

const WRAPPER_VARIANTS: Variants = {
    normal: {
        scale: 1,
        color: "currentColor",
    },
    animate: {
        scale: 1.1,
        color: "#ef4444",
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 15,
        },
    },
};

const HEART_VARIANTS: Variants = {
    normal: {
        scale: 1,
        y: 0,
    },
    animate: {
        scale: [1, 1.15, 1.05, 1.15, 1],
        y: [0, -1, 0, -1, 0],
        transition: {
            duration: 0.8,
            ease: "easeInOut",
        },
    },
};
interface HeartIconProps extends HTMLMotionProps<"div"> {
    label?: string;
    size?: number;
}
export interface HeartIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}



const ProductHeartIcon = forwardRef<HeartIconHandle, HeartIconProps>(
    (
        {
            label = "",
            className,
            size = 18,
            onMouseEnter,
            onMouseLeave,
            ...props
        },
        ref
    ) => {
        const controls = useAnimation();
        const isControlledRef = useRef(false);

        useImperativeHandle(ref, () => {
            isControlledRef.current = true;
            return {
                startAnimation: () => controls.start("animate"),
                stopAnimation: () => controls.start("normal"),
            };
        });

        const handleMouseEnter = useCallback(
            (e: MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) {
                    onMouseEnter?.(e);
                } else {
                    controls.start("animate");
                }
            },
            [controls, onMouseEnter]
        );

        const handleMouseLeave = useCallback(
            (e: MouseEvent<HTMLDivElement>) => {
                if (isControlledRef.current) {
                    onMouseLeave?.(e);
                } else {
                    controls.start("normal");
                }
            },
            [controls, onMouseLeave]
        );

        return (
            <motion.div
                className={cn(
                    "flex items-center gap-2 cursor-pointer select-none",
                    className
                )}
                variants={WRAPPER_VARIANTS}
                animate={controls}
                initial="normal"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                <motion.svg
                    variants={HEART_VARIANTS}
                    fill="none"
                    height={size}
                    width={size}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ willChange: "transform" }}
                >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </motion.svg>

                <motion.span
                    className="text-sm font-MyFont"
                    variants={{
                        normal: { opacity: 0.8 },
                        animate: { opacity: 1 },
                    }}
                >
                    {label}
                </motion.span>
            </motion.div>
        );
    }
);

ProductHeartIcon.displayName = "ProductHeartIcon";
export { ProductHeartIcon };
