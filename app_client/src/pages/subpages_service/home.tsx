import { BriefcaseBusiness, Loader2, MessagesSquare } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";


import { CreateSpaceDialog } from "@/components/sidebar";
import { useGeneralTutorStore } from "@/stores/generalTutorStore";
import { useNavigate } from "react-router-dom";
import { useSourceStore } from "@/stores/sourceStore";

export function Home() {
    const {
        isMdScreen
    } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
        })),
    )
    const {
        generalTutorGetLessonList,
        setActiveGeneralTutorSpace,

        generalTutorSpaceSubscriptionList,
        generalTutorActiveSpace,
        generalTutorLoading,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorGetLessonList: state.generalTutorGetLessonList,
            setActiveGeneralTutorSpace: state.setActiveGeneralTutorSpace,
            generalTutorSpaceSubscriptionList: state.generalTutorSpaceSubscriptionList,
            generalTutorActiveSpace: state.generalTutorActiveSpace,
            generalTutorLoading: state.loading,
        })),
    )
    const {
        getSources
    } = useSourceStore(
        useShallow((state) => ({
            getSources: state.getSources,
        })),
    )
    const { setError } = useForm<any>()
    const navigate = useNavigate()

    return (
        <div className='flex flex-row  m-auto !min-h-full !break-words text-pretty px-1 md:px-2 dark:text-primary/80 w-full'>
            <div className={`flex flex-col md:flex-row-reverse mx-auto text-xl  w-full ${isMdScreen ? ('p-0') : ("p-2 !justify-center")} gap-2`}>
                <div className={`
                flex flex-col justify-between text-break text-wrap w-[min(98%,900px)] mx-auto min-h-[105vh]
                mt-[20vh]
                `}>
                    <div>
                        <div className='text-center !w-full mb-8'>
                            <BriefcaseBusiness className="m-auto" size={35} />
                            <span>Start Prep</span>
                        </div>
                        <div>
                            {generalTutorLoading.generalTutorGetSpaceSubscriptionList ? (<Loader2 className='m-auto animate-spin' />) : (
                                <div className={`flex flex-row justify-center flex-wrap gap-2 mt-2`}>
                                    <div className='w-full flex flex-col md:flex-row justify-center gap-4 mb-8'>
                                        <CreateSpaceDialog />
                                    </div>
                                    {generalTutorSpaceSubscriptionList.slice(0, 8).map((space_subscription) => (
                                        space_subscription?.space?.name && (
                                            <Button
                                                size="icon"
                                                className='relative w-44 mr-1 h-10 mt-1 text-center !p-4 flex flex-row justify-center'
                                                onClick={() => {
                                                    if (
                                                        space_subscription?.space?.hid !== generalTutorActiveSpace?.hid
                                                    ) {
                                                        generalTutorGetLessonList(setError, space_subscription?.space?.hid)
                                                        setActiveGeneralTutorSpace(space_subscription?.space)
                                                        getSources(setError, true, space_subscription?.space?.hid)
                                                    }
                                                    navigate('/new_reading')
                                                }}
                                                key={`space_${space_subscription?.space?.hid}`}
                                            >
                                                <div className='flex flex-row overflow-hidden'>
                                                    <MessagesSquare className="!w-[20px] !h-[20px] mt-auto mb-auto mr-2" />
                                                    <span
                                                        className="mt-auto mb-auto text-md w-full overflow-hidden"
                                                    >
                                                        {space_subscription?.space?.name}
                                                    </span>
                                                </div>
                                            </Button>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
