import Photo from "./photoClient";
import UploadSectionClient from "./uploadSectionClient";


export default function CostumeContestClient() {
    return (
        <section className='mb-8 p-4 w-full border-y border-accent/50'>
            <h2 className="font-semibold mb-5 w-fit mx-auto border-b-2 border-accent/50 px-7">Halloween Costume Contest</h2>
            <div className="flex flex-col md:flex-row justify-center mb-4 gap-4">
                <Photo alt={"Costume Contest Location"} pos={[39.38473337003943, -78.04291993823446]} />
                <div className="flex flex-col justify-between">
                    <p className="!text-xl md:!text-2xl">
                        Take a photo <strong>at this location <span className="hidden md:inline-block">(see left)</span><span className="md:hidden">(see above)</span></strong> while wearing a costume
                        <br /> <br /> Then,
                    </p>
                <UploadSectionClient uploadUrl={""} title={"Enter the Costume Contest!"} subtitle={"Upload your costume photo"} id={"upload"}/>
                </div>

            </div>
        </section>
    )
}