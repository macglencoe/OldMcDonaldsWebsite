"use client"
// components/TestimonialCarousel.js
import { useState } from 'react';
import styles from "./testimonials.module.css"

const testimonials = [
    {
        quote: "I have visited old McDonalds farm for as long as I can remember. It is always a pleasant experience, bringing me memories of my family’s farm down south, as we made it a yearly tradition to visit old McDonalds when they came to visit from out of state. The staff is amazing, always welcoming and make us feel at home. If you have children, their playground area is wonderful, and they will love petting and seeing the farm animals. My daughter truly enjoyed that experience, I know your kids will want to come back again! 10/10 highly recommend.",
        author: "Selene",
    },
    {
        quote: "Old McDonald Pumpkin Patch is my favorite place to spend a fall day at. You can spend hours there getting lost in the corn maze, going for a hay ride, and petting the animals. They have plenty of family friendly activities and great photo ops! They also have a wide variety of pumpkins for the best prices. And I loooove the apple cider slushies!!",
        author: "Camille Santiago",
    },
    {
        quote: "We had a wonderful day at old McDonald’s pumpkin patch. Admission is very low compared to the other fall festival attractions. The hayride was fun. The food they had on site was not overpriced and delicious. They are things to do for all ages. It was not crowded and as very well run by the MCDonald family. Every year they continue to add new things. We have been coming for years and will continue to do so. Come with your family and have a great time while supporting a local run business!",
        author: "Bill Wolff",
    },
    // …add as many as you like
];

const slides = [
    ...testimonials,
    {cta: true}
]

export default function TestimonialCarousel() {
    const [current, setCurrent] = useState(0);
    const last = slides.length - 1;

    const goPrev = () =>
        setCurrent(current === 0 ? last : current - 1);

    const goNext = () =>
        setCurrent(current === last ? 0 : current + 1);

    return (
        <div className={`relative mx-auto py-6 md:p-6 bg-foreground ` + styles.container}>
            {/* SLIDES */}
            <div className='
                relative
                md:w-fit
                m-auto
            '>
                <div className='
                    absolute 
                    top-[-20px] md:left-[-20px] left-0 
                    w-[60px] h-[60px] 
                    bg-accent 
                    rounded-full
                    z-10
                    flex
                    justify-center
                    items-center
                '>
                    <svg fill='var(--background)' width="45px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 696.64 547.55">
  <path d="m462.97,258.91c216.32-97.29,341.79,227.13,108.2,286.38-231.63,26.03-238.9-310.82-129.06-444.27,15.3-31.62,145.39-128.93,170.87-93.28,13.05,42.79-149.02,58.29-150.01,251.17Z" />
  <path d="m95.43,256.75c227.19-91.89,325.88,256.94,83.03,290.78-209.35,2.61-211.56-286.63-123.75-418.98C72.37,85.07,209.89-29.16,249.15,8.24c2.85,7.15,1.26,15.62-4.98,20.35-86.21,44.21-151.77,127.84-148.75,228.16Z"/>
</svg>
                </div>
                <div className='
                    absolute 
                    bottom-[-20px] md:right-[-20px] right-0
                    w-[60px] h-[60px] 
                    bg-accent 
                    rounded-full
                    z-10
                    flex
                    justify-center
                    items-center
                    rotate-180
                '>
                    <svg fill='var(--background)' width="45px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 696.64 547.55">
  <path d="m462.97,258.91c216.32-97.29,341.79,227.13,108.2,286.38-231.63,26.03-238.9-310.82-129.06-444.27,15.3-31.62,145.39-128.93,170.87-93.28,13.05,42.79-149.02,58.29-150.01,251.17Z" />
  <path d="m95.43,256.75c227.19-91.89,325.88,256.94,83.03,290.78-209.35,2.61-211.56-286.63-123.75-418.98C72.37,85.07,209.89-29.16,249.15,8.24c2.85,7.15,1.26,15.62-4.98,20.35-86.21,44.21-151.77,127.84-148.75,228.16Z"/>
</svg>
                </div>

                <div className={`
                    overflow-hidden 
                    max-w-[1300px] m-auto 
                    p-3 md:rounded-2xl
                    bg-background
                `+ styles.slide}>
                    <div
                        className="
                            flex 
                            transition-transform duration-500 
                            py-10
                        "
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {slides.map((slide, i) => (
                            <div
                                key={i}
                                className="flex flex-col justify-center flex-shrink-0 w-full text-center px-4 md:px-6 gap-4"
                            >

                                {slide.cta ? (
                                    <a className='text-accent text-lg md:text-xl font-bold' href='https://www.google.com/search?sca_esv=237638b250c80c54&sxsrf=AE3TifNjJeZhkX7FLcEXxOCOKc9j3deHsw:1748025394035&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E7thinwkcLqOSb8-0N1sKqXYMcV1KHbio18FqC7N4w06yxKOuT_JXCwGMOBpVg3ATOSyJ7ypSsp1eFiMBW_Y1Bl-wJ5gwayLq3mZeS9ZPEKRb4O0VqNX-Ngs2l_jdlwKvWcSpc0%3D&q=Old+McDonalds+Pumpkin+Patch+%26+Corn+Maze+Reviews&sa=X&ved=2ahUKEwij3a2FnrqNAxUiAHkGHRpNIUoQ0bkNegQIJRAD&biw=1713&bih=905&dpr=1' target='_blank' rel='noopener noreferrer'>See more reviews on Google</a>
                                ) : (
                                    <>
                                        <p className="italic text-base md:text-lg">{slide.quote}</p>
                                        <p className=" font-semibold">— {slide.author}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ARROWS */}
            <button
                onClick={goPrev}
                aria-label="Previous testimonial"
                className="absolute top-[45%] left-0 md:left-7 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:text-accent hover:scale-105 font-bold text-2xl"
            >
                ‹
            </button>
            <button
                onClick={goNext}
                aria-label="Next testimonial"
                className="absolute top-[45%] right-0 md:right-7 transform -translate-y-1/2 bg-white p-2 rounded-full shadow  hover:text-accent hover:scale-105 font-bold text-2xl"
            >
                ›
            </button>

            {/* DOTS */}
            <div className="flex justify-center mt-6 space-x-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2 h-2 rounded-full focus:outline-none ${i === current ? 'bg-accent' : 'bg-background'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
