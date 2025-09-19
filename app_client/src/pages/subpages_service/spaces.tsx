import { SheetRabbit } from "@/components/chatinput";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import { useAppStore } from "@/stores/appStore";

import { useGeneralTutorStore } from "@/stores/generalTutorStore";
import { QuestionsOutline } from "@/components/questionsoutline";
import { useNoteStore } from "@/stores/noteStore";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@nextui-org/react";

export function EraseSpace(props: { space_hid: string }) {
    const { generalTutorDeleteSpace, setActiveGeneralTutorSpace } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorDeleteSpace: state.generalTutorDeleteSpace,
            setActiveGeneralTutorSpace: state.setActiveGeneralTutorSpace
        })),
    )

    const { setError } = useForm<any>({})
    return (
        <AlertDialog >
            <AlertDialogTrigger className='flex flex-row w-fit text-primary mb-auto mr-1 text-center justify-center p-2 bg-transparent mt-8'>
                <Trash
                    size={14}
                    strokeWidth={1.75}
                    absoluteStrokeWidth
                    className='text-primary/70 hover:text-primary hover:cursor-pointer'
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className='text-primary'>
                            This will erase this interview case, your progress
                            and data will be lost.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className='w-full flex flex-row justify-between my-4'>
                        <div className='w-40'>
                            <AlertDialogCancel className="m-0 p-0 border-0">
                                <Button
                                    type='submit'
                                    className='w-full text-destructive'
                                    onClick={() => {
                                        generalTutorDeleteSpace(setError, props.space_hid)
                                        setActiveGeneralTutorSpace(null)
                                    }}
                                > Erase Case
                                </Button>
                            </AlertDialogCancel>
                        </div>
                        <AlertDialogCancel className=''>Cancel</AlertDialogCancel>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export function Spaces() {
    const {
        isMdScreen
    } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
        })),
    )
    const {
        generalTutorActiveSpace,
        generalTutorLoading,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorActiveSpace: state.generalTutorActiveSpace,
            generalTutorLoading: state.loading,
        })),
    )
    const {
        resetNotes,
    } = useNoteStore(
        useShallow((state) => ({
            resetNotes: state.resetNotes,
        })),
    )
    const navigate = useNavigate()


    useEffect(() => {
        resetNotes()
    }, [generalTutorActiveSpace])
    if (!generalTutorActiveSpace || !('hid' in generalTutorActiveSpace)) {
        navigate('/')
        return null
    }
    const space_hid = generalTutorActiveSpace && 'hid' in generalTutorActiveSpace ? generalTutorActiveSpace.hid : ''


    return (
        <div className='flex flex-row  m-auto !min-h-full !break-words text-pretty px-1 md:px-2 dark:text-primary/80 w-full'>
            <div className={`flex flex-col md:flex-row-reverse mx-auto text-xl  w-full ${isMdScreen ? ('p-0') : ("p-2 !justify-center")} gap-2`}>
                <div className={`
                flex flex-col justify-between text-break text-wrap w-[min(98%,900px)] mx-auto min-h-[105vh]
                `}>
                    <div className='text-center !w-full'>
                        <div className={`
                                text-left mt-8 mb-[100px] ${isMdScreen ? ('!text-[13px]') : ("!text-[13px]")} min-w-0
                                m-auto
                                !w-full
                            `}
                        >
                            {generalTutorLoading.generalTutorGetSpaceDetail ? (
                            <Skeleton className='rounded-2xl w-[80%] h-[50vh] m-auto' />
                            ): (
                                <>
                            <h1 className = 'm-auto text-center underline underline-offset-4 text-3xl mb-8'>
                                {generalTutorActiveSpace.name}
                        </h1>
                        <QuestionsOutline space_hid={space_hid} />
                        <SheetRabbit space_hid={space_hid} />
                        <EraseSpace space_hid={space_hid} />
                    </>
                        )}
                </div>
            </div>
        </div>
            </div >
        </div >
    )
}
