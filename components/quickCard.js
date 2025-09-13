import Link from "next/link";
import { ArrowSquareOut } from "phosphor-react";

export default function QuickCard({ title, href, image, Icon, external }) {
    const Wrapper = external ? 'a' : Link;
    const props = external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href };
    return (
        <Wrapper {...props} className="relative rounded-xl overflow-hidden shadow-xl border-4 border-background group cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
                aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            <div className="relative z-20 h-full p-4 text-white flex flex-col justify-end">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    {Icon && <Icon />}
                    <h3 className="text-sm md:text-xl font-bold uppercase">{title}</h3>
                </div>
                <span className="text-sm md:text-lgmt-1 underline underline-offset-2 group-hover:text-accent flex items-center gap-1">
                    Learn more <ArrowSquareOut size={18} weight="bold" />
                </span>
            </div>
        </Wrapper>
    );
}

