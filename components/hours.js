
import hours from '@/public/data/hours.json';

export default function Hours() {
    return (
        <div className="mb-12">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hours.map(({ day, open, close }) => (
                    <li key={day} className="rounded-lg overflow-hidden shadow hover:shadow-md transition">
                        {/* Day Header */}
                        <div className="py-3 px-6 bg-background/10 justify-center items-center flex">
                            <h2 className="text-xl font-semibold text-background/60">{day}</h2>
                        </div>
                        
                        {/* Open and Close Times */}
                        <div className="relative flex flex-row justify-around gap-2 text-background flex-wrap" style={{
                            backgroundImage: 'url(/entrance.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}>
                            {/* Background Overlay */}
                            <div className="absolute inset-0 bg-background/50" />
                            {/* Decorative Skewed Divider */}
                            <div className="absolute -right-full h-full left-1/2 bg-foreground/80" style={{
                                transform: 'skewX(-45deg)',
                            }}/>
                            {/* Opening Time */}
                            <div className="flex flex-col text-left m-5 z-10">
                                <span className="text-foreground font-bold text-2xl">{open}</span>
                                <span className="text-foreground font-bold uppercase">Open</span>
                            </div>

                            {/* Closing Time */}
                            <div className="flex flex-col text-right m-5 z-10">
                                <span className="text-background font-bold uppercase">Close</span>
                                <span className="text-background font-bold text-2xl">{close}</span>
                            </div>
                            
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
