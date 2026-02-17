import clsx from "clsx";
import Link from "next/link";
import React from "react";

/**
 * Shared CTA button that supports anchor, Next.js Link, or button element.
 */
const Action = React.forwardRef(function Action(
  {
    as = "button", // "button", "a", or "Link"
    href,
    onClick,
    children,
    className,
    variant = "primary",
    ...props
  },
  ref
) {
  const baseStyles = "py-2 px-4 w-fit rounded-full font-bold font-['Inter']";

  const variants = {
    primary: "bg-accent !text-background hover:bg-accent/80",
    secondary: "bg-foreground !text-background hover:bg-foreground/80",
    tertiary: "bg-background !text-foreground hover:bg-background/80",
    "outline-primary": "border-accent border-2 !text-accent hover:bg-accent/20",
    "outline-secondary": "border-foreground border-2 !text-foreground hover:bg-foreground/20",
    "outline-tertiary": "border-background border-2 !text-background hover:bg-background/20",
  };

  const classes = clsx(baseStyles, variants[variant], className);

  if (as === "Link") {
    return (
      <Link href={href} className={classes} ref={ref} {...props}>
        {children}
      </Link>
    );
  }

  if (as === "a") {
    return (
      <a href={href} className={classes} ref={ref} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes} ref={ref} {...props}>
      {children}
    </button>
  );
});

export { Action };
