"use client";
import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import type { HTMLMotionProps } from "motion/react";
import { cn } from "../../../lib/utils";

/* -------------------- Types -------------------- */

export interface CartIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface CartIconProps extends HTMLMotionProps<"div"> {
  label?: string;
  size?: number;
}

/* -------------------- Animation Variants -------------------- */

const WRAPPER_VARIANTS: Variants = {
  normal: {
    scale: 1,
    color: "currentColor",
  },
  animate: {
    scale: 1.1,
    color: "currentColor4",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

const CART_VARIANTS: Variants = {
  normal: {
    scale: 1,
    color: "currentColor",
  },
  animate: {
    color: "currentColor",
    scale: 1.1,
    y: [0, -5, 0],
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      y: { repeat: 1, delay: 0.1, duration: 0.4 },
    },
  },
};

/* -------------------- Component -------------------- */

const CartIcon = forwardRef<CartIconHandle, CartIconProps>(
  (
    {
      label = "CART",
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

    const handleMouseEnter = useCallback<
      React.MouseEventHandler<HTMLDivElement>
    >(
      (e) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback<
      React.MouseEventHandler<HTMLDivElement>
    >(
      (e) => {
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
          "flex items-center gap-2 cursor-pointer select-none")}
        variants={WRAPPER_VARIANTS}
        animate={controls}
        initial="normal"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          transition={{ duration: 0.2 }}
          variants={CART_VARIANTS}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            className
          )}
        >
          <path d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z" />
        </motion.svg>

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

CartIcon.displayName = "CartIcon";

export { CartIcon };
