import { Button } from "@/components/ui/button";
import { BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HIW_Hero = () => {
    const navigate = useNavigate()
    return (
        <>
            <section className="flex flex-col md:flex-row gap-4 place-items-center py-8 md:py-8">
                <div className="text-center lg:text-start space-y-2 m-auto">
                    <main className="text-2xl md:text-6xl font-bold">
                        <div className='flex flex-col m-auto justify-center'>
                            <BriefcaseBusiness strokeWidth={0.55} absoluteStrokeWidth className='m-auto w-[150px] h-[150px] md:w-[200px] md:h-[200px]' />
                            <div className='text-3xl text-center mb-8'>
                                PDF HUB
                                <br />

                            </div>
                        </div>
                    </main>

                </div>
                <div className={`mt-4 flex flex-col justify-center w-full border-2 broder-primary/44 p-2 rounded-xl`}>
                    <iframe
                        className="m-auto min-w-[80%] min-h-[40dvh] mt-2"
                        src={`https://www.youtube.com/embed/erjcf1n2fMo`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Embedded youtube`}
                    />
                </div>
            </section>
            <div className='flex flex-col md:flex-row w-full justify-center gap-4'>
                <Button variant="default" size="icon" className='mt-auto mb-auto w-fit m-auto text-2xl p-12' onClick={() => {
                    navigate('/auth')
                }}>
                    Login / SignUp
                </Button>
            </div>
        </>
    );
};
