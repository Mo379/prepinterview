import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BriefcaseBusiness } from "lucide-react"
function About() {

    return (
        <>
            <div className='text-sm  dark:prose-invert m-auto text-center mt-4'>
                <h1 className='m-auto text-center mb-8 w-full'>
                </h1>
                <div className='w-full flex flex-col md:flex-row justify-center mt-4 gap-4'>
                    <Card className="w-[80%] m-auto ">
                        <CardHeader>
                            <CardTitle className='underline'></CardTitle>
                            <CardDescription>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4 border-success max-w-prose prose prose-slate prose-sm m-auto">
                                <div className="">
                                    <div className='flex flex-col justify-center'>
                                        <div className='flex flex-col m-auto justify-center text-primary stroke-primary'>
                                            <BriefcaseBusiness size={96} strokeWidth={1.75} absoluteStrokeWidth className='m-auto' />
                                            <div className='text-sm text-center text-xl'>
                                                Welcome to PrepInterview
                                            </div>
                                            <div className='text-ring text-center/25 text-xs'>
                                                Your Personalised Interview Preparation
                                            </div>
                                            <div className='text-ring  mt-8'>
                                                PrepInterview Is A Simple & Powerful Personalised Interview Questions Generator.
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default About
