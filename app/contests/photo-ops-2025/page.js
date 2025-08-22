import Layout from '@/components/layout'
import PageHeader from '@/components/pageHeader'
import Image from 'next/image'
import Link from 'next/link'
import path from 'path'

export default function PhotoOps2025() {
    const winners = [
        {
            title: "Barrel Saddle",
            "winner": {
                "name": "Tara Painter",
                "src": "/saddle-tara-painter.jpg"
            }
        },
        {
            title: "Pumpkin Stand",
            "winner": {
                "name": "Ashley Ford",
                "src": "/pumpkin-stand-ashley-ford.jpg"
            }
        },
        {
            title: "Forge Bridge",
            winner: {
                "name": "Jenna Neff",
                "src": "/forge-bridge-jenna-neff.jpg"
            }
        },
        {
            title: "Tractor",
            winner: {
                name: "Samantha Janes",
                src: "/tractor-samantha-janes.jpg"
            }
        },
        {
            title: "Pumpkin Patch",
            winner: {
                name: "Hayley Briggs",
                src: "pumpkin-patch-hayley-briggs.jpg"
            }
        },
        {
            title: "High Five, We Got Out Alive",
            winner: {
                name: "Angela Stoneberger",
                src: "/high-five-angela-stoneberger.jpg"
            }
        },
        {
            title: "Sunflower Swing",
            winner: {
                name: "Megan Shaffer",
                src: "/sunflower-swing.jpg"
            }
        },
        {
            title: "Iron Tub",
            winner: {
                name: "Stacey Hottle",
                src: "/iron-tub.jpg"
            }
        },
        {
            title: "Butterfly Wings",
            winner: {
                name: "Carolyn Cordova",
                src: "/butterfly-wings.jpg"
            }
        },
        {
            title: "Bench by the Bridge",
            winner: {
                name: "Samantha Janes",
                src: "bench-bridge.jpg"
            }
        },
        {
            title: "Big Chair",
            winner: {
                name: "Susan Marie Hargroves",
                src: "big-chair.jpg"
            }
        },
        {
            title: "Corn Maze Entrance",
            winner: {
                name: "Brandy Hayslette",
                src: "corn-maze-entranc.jpg"
            }
        }

    ]

    return (
        <Layout>
            <PageHeader subtitle="2025">Photo Ops Contest</PageHeader>
            <div className='max-w-5xl mx-auto flex flex-col gap-2 md:gap-5'>
                <div className='body basic !my-25'>
                    <p>This contest was held on Facebook to gather the best in-season photographs of our photo ops</p>
                    <p>The winners of each of the following categories will be featured on the <Link href={"/map"}>Map</Link>!</p>
                </div>
                {winners.map((category, i) => (
                    <div className='bg-foreground/5 p-1 md:p-4 flex flex-row items-center justify-between rounded-3xl border border-foreground/10' id={category.winner.src}>
                        <div className='m-3'>
                            <h2 className='text-foreground'>
                                <span className='opacity-50'>Photo Op:</span>
                                <br />
                                <strong className='text-xl md:text-5xl font-satisfy'>{category.title}</strong>
                            </h2>
                            <br />
                            <p className='text-foreground'>
                                <span className='opacity-50'>Winner:</span>
                                <br />
                                <strong className='text-2xl md:text-4xl underline decoration-accent font-satisfy'>{category.winner.name}</strong>
                            </p>
                        </div>
                        <Link href={path.join('/photo-ops', category.winner.src)}>
                            <Image className='h-[40vw] w-[40vw] min-w-[40vw] md:min-w-[unset] md:h-[300px] md:w-[300px] object-cover rounded-xl hover:scale-110 transition-all' src={path.join('/photo-ops', category.winner.src)} width={300} height={300} alt={category.winner.name} />

                        </Link>
                    </div>
                ))
                }
            </div>
        </Layout>

    )
}