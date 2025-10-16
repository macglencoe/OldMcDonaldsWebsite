import Action from "../action";

export default function SurveyBanner({ href }) {
    return (
        <section className="w-full bg-foreground px-4 py-10">
            <div className="relative mx-auto flex max-w-5xl flex-col gap-8 overflow-hidden rounded-3xl border text-foreground/20 bg-background p-8 shadow-xl md:flex-row md:items-center md:justify-between">

                <div className="relative z-10 max-w-xl space-y-4 text-center md:text-left">
                    <h2 className="text-4xl font-semibold text-foreground md:text-5xl">
                        We want to hear from you!
                    </h2>
                    <p className="text-base text-foreground/80 md:text-lg">
                        Your feedback shapes the next season of Old McDonald's.
                    </p>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-3 md:items-end">
                    <Action as="a" href={href} variant="primary">Take the Survey</Action>
                    <span className="text-xs text-foreground/80">
                        Quick 3-minute questionnaire via Google Forms.
                    </span>
                </div>
            </div>
        </section>
    );
}
