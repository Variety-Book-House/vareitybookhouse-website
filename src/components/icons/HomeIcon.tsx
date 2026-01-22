"use client";

import type { Variants, HTMLMotionProps } from "motion/react";
import { motion, useAnimation } from "motion/react";
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
} from "react";
import type { MouseEvent } from "react";
import { cn } from "../../../lib/utils";

/* -------------------- Types -------------------- */

export interface HomeIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

export interface HomeIconProps extends HTMLMotionProps<"div"> {
    label?: string;
    size?: number;
}

/* -------------------- Animation Config -------------------- */

const DEFAULT_TRANSITION = {
    duration: 0.6,
    opacity: { duration: 0.2 },
};

const WRAPPER_VARIANTS: Variants = {
    normal: {
        scale: 1,
        color: "currentColor",
    },
    animate: {
        scale: 1.1,
        color: "brown",
        transition: {
            type: "spring",
            stiffness: 280,
            damping: 16,
        },
    },
};

const PATH_VARIANTS: Variants = {
    normal: {
        pathLength: 1,
        opacity: 1,
    },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
    },
};

/* -------------------- Component -------------------- */

const HomeIcon = forwardRef<HomeIconHandle, HomeIconProps>(
    (
        {
            label = "HOME",
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
                {/* ICON */}
                <motion.svg
                    fill="none"
                    height={size}
                    width={size}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />

                    <motion.path
                        d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
                        variants={PATH_VARIANTS}
                        animate={controls}
                        transition={DEFAULT_TRANSITION}
                    />
                </motion.svg>

                {/* LABEL */}
                <motion.span
                    className="text-sm font-light"
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

HomeIcon.displayName = "HomeIcon";
export { HomeIcon };
