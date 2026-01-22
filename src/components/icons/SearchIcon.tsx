"use client";
import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../../lib/utils";
import type { HTMLMotionProps } from "motion/react";
import type { MouseEvent } from "react";
const WRAPPER_VARIANTS: Variants = {
    normal: {
        scale: 1,
        color: "currentColor",
    },
    animate: {
        scale: 1.1,
        color: "currentColor",
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 18,
        },
    },
};

const ICON_VARIANTS: Variants = {
    normal: {
        x: 0,
        y: 0,
    },
    animate: {
        x: [0, 0, -3, 0],
        y: [0, -4, 0, 0],
    },
};
export interface CartIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

export interface CartIconProps extends HTMLMotionProps<"div"> {
    label?: string;
    size?: number;
}
const SearchIcon = forwardRef<CartIconHandle, CartIconProps>(
    (
        {
            label = "SEARCH",
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
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    variants={ICON_VARIANTS}
                    transition={{
                        duration: 1,
                        bounce: 0.3,
                    }}
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
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

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };
