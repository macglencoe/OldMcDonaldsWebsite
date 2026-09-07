import Link from "next/link";
import { ArrowRight, ArrowSquareOut } from "phosphor-react";

export default function EssentialActions({ actions, className = "" }) {
    return (
        <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
            {actions.map(({ title, description, href, Icon, external, native, primary }) => {
                const Wrapper = external || native ? "a" : Link;
                const props = external
                    ? { href, target: "_blank", rel: "noopener noreferrer" }
                    : { href };
                const TrailingIcon = external ? ArrowSquareOut : ArrowRight;

                return (
                    <Wrapper
                        key={title}
                        {...props}
                        className={`group flex min-h-24 items-center gap-4 rounded-xl border px-5 py-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            primary
                                ? "border-accent bg-accent text-background shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                                : "border-foreground/15 bg-background text-foreground hover:border-accent/60 hover:bg-accent/5"
                        }`}
                    >
                        {Icon && (
                            <span className={`shrink-0 rounded-full p-2.5 ${primary ? "bg-background/15" : "bg-accent/10 text-accent"}`}>
                                <Icon size={26} weight="duotone" aria-hidden />
                            </span>
                        )}
                        <span className="min-w-0 flex-1">
                            <span className="block text-lg font-semibold leading-tight">{title}</span>
                            {description && (
                                <span className={`mt-1 block text-sm leading-snug ${primary ? "text-background/85" : "text-foreground/65"}`}>
                                    {description}
                                </span>
                            )}
                        </span>
                        <TrailingIcon className="shrink-0 transition-transform group-hover:translate-x-0.5" size={20} aria-hidden />
                    </Wrapper>
                );
            })}
        </div>
    );
}
