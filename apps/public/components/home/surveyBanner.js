import { Action } from "@oldmc/ui";

export default function SurveyBanner({ href }) {
    return (
        <section className="w-full bg-foreground px-4 py-10">
            <div className="relative mx-auto flex max-w-5xl flex-col gap-8 overflow-hidden rounded-3xl bg-background/10 border-2 border-background/10 p-8 shadow-xl md:flex-row md:items-center md:justify-between text-background">

                <div className="relative z-10 max-w-xl space-y-4 text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-semibold">
                        We want to hear from you!
                    </h2>
                    <p className="text-base md:text-lg text-background/50">
                        Your feedback shapes the next season of Old McDonald&apos;s.
                    </p>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-3 md:items-end">
                    <Action as="a" href={href} variant="primary">Take the Survey</Action>
                    <span className="text-xs text-background/50">
                        Quick 3-minute questionnaire via Google Forms.
                    </span>
                </div>
            </div>
        </section>
    );
}
