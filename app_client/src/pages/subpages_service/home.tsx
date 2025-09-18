import { BriefcaseBusiness, Loader2, MessagesSquare, ChevronDown, CirclePlus, Trash } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";


import { useGeneralTutorStore } from "@/stores/generalTutorStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion"
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
import { SubmitHandler } from "react-hook-form"
import { Skeleton } from "@/components/ui/skeleton"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import InlineAlertComponent, { handleAlertColors } from "@/components/errors";


export function CreateSpaceDialog(props: { showSmall?: boolean }) {
    const { generalTutorCreateSpace, generalTutorLoading } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorCreateSpace: state.generalTutorCreateSpace,
            generalTutorLoading: state.loading,
        })),
    )
    const [open, setOpen] = useState(false);


    const FormSchema = z.object({
        name: z.string().min(1, 'Please provice a name for the space.'),
    })
    type FormType = z.infer<typeof FormSchema>


    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })


    const onSubmit: SubmitHandler<FormType> = (data) => {
        generalTutorCreateSpace(setError, data.name)
        setOpen(false)
    }


    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                {props.showSmall ? (
                    <Button
                        className='w-full text-center !p-2 flex flex-row justify-center bg-transparent !text-sm relative text-primary border-primary/35'
                        variant='outline'
                        onClick={() => { setOpen(true) }}
                    >
                        <div className='flex flex-row'>
                            <CirclePlus
                                className="!w-[12px] !h-[12px] mt-auto mb-auto m-auto mr-1" />
                            <span
                                className="mt-auto mb-auto text-[11px] w-full overflow-hidden"
                            >
                                Create Case
                            </span>
                        </div>
                    </Button>
                ) : (
                    <Button
                        className='w-fit text-center !p-[26px] flex flex-row justify-center border-primary/35 md:m-0 m-auto'
                        onClick={() => { setOpen(true) }}
                    >
                        <div className='flex flex-row'>
                            <CirclePlus
                                className="!w-[20px] !h-[20px] mt-auto mb-auto m-auto mr-1" />
                            <span
                                className="mt-auto mb-auto text-lg w-full overflow-hidden"
                            >
                                Create Case
                            </span>
                        </div>
                    </Button>
                )}
                <AlertDialogContent className='max-h-[80dvh] overflow-scroll scrollbar-hide'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Create Case</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className='text-primary'>
                                Provide a name for this case.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                        <div className="flex flex-col">
                            <div className="flex flex-col justify-between w-[98%] md:w-[80%]">
                                <div className="flex flex-col gap-2 w-full m-auto p-2">
                                    <Input
                                        placeholder="case name..."
                                        id="name"
                                        {...register("name")}
                                        className={`
                                            border border-${errors.name && handleAlertColors(errors.name)}
                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                        `}
                                    />
                                    {errors.name && (
                                        <InlineAlertComponent custom_error={errors.name} />
                                    )}
                                </div>
                                <div className='w-full flex flex-row justify-between my-4'>
                                    <div className='w-40'>
                                        {generalTutorLoading.generalTutorCreateSpace ? (
                                            <Button disabled className="w-full ">
                                                <Loader2 className="animate-spin" />
                                            </Button>
                                        ) : (
                                            <Button type='submit' className='w-full '> Create </Button>
                                        )}
                                    </div>
                                    <AlertDialogCancel className=''>Cancel</AlertDialogCancel>
                                </div>
                            </div>
                        </div>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
export function SpacesList() {
    const {
        generalTutorSpaceSubscriptionList,
        generalTutorActiveSpace,
        generalTutorGetLessonList,
        setActiveGeneralTutorSpace,
        generalTutorLoading,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorSpaceSubscriptionList: state.generalTutorSpaceSubscriptionList,
            generalTutorCreateSpace: state.generalTutorCreateSpace,
            generalTutorActiveSpace: state.generalTutorActiveSpace,
            generalTutorGetLessonList: state.generalTutorGetLessonList,
            setActiveGeneralTutorSpace: state.setActiveGeneralTutorSpace,
            generalTutorLoading: state.loading,
        })),
    )
    const navigate = useNavigate()
    const [accordionOpen, setAccordionOpen] = useState(false);


    const FormSchema = z.object({
        name: z.string().min(1, 'Please provice a name for the space.'),
    })
    type FormType = z.infer<typeof FormSchema>


    const { setError } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })


    return (
        <>
            <Button
                onClick={() => setAccordionOpen((prev) => !prev)}
                variant="ghost"
                size="icon"
                className="w-full h-10 mt-1 text-start !p-2 flex flex-row justify-start bg-transparent relative"
            >
                <MessagesSquare size={35} className="mt-auto mb-auto" />
                <span className="mt-auto mb-auto"> Reading Spaces </span>
                <span className='absolute right-2 rounded-full p-[4px]'>
                    <ChevronDown
                        className={`
                                !h-5 !w-5 shrink-0 transition-transform duration-200 stroke-primary
                                transition-transform duration-200 ${accordionOpen ? 'rotate-180' : ''}
                                `}
                    />
                </span>

            </Button>

            <Accordion
                type="single"
                collapsible
                // When accordionOpen is true, set value to "item-1"; otherwise, no item is open.
                value={"item-1"}
                // Keep state in sync if the user interacts with the accordion trigger
                className=""
            >
                <AccordionItem value="item-1" className="border-0">
                    {/* You can keep this trigger if you want to allow clicking on it too */}
                    <div className="pl-1 border-l border-primary/35 ml-2">
                        <AccordionContent>
                            {generalTutorLoading.generalTutorGetSpaceSubscriptionList ? (
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="w-full  h-[18px] rounded-full" />
                                    <Skeleton className="w-full  h-[18px] rounded-full" />
                                    <Skeleton className="w-full  h-[18px] rounded-full" />
                                </div>
                            ) : (
                                <>
                                    <CreateSpaceDialog showSmall={true} />
                                    {generalTutorSpaceSubscriptionList.map((space_subscription: any) => (
                                        space_subscription?.space?.name && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className='relative w-full h-10 mt-1 text-start !p-2 flex flex-row justify-start bg-transparent'
                                                onClick={() => {
                                                    navigate('/new_reading')
                                                    if (
                                                        space_subscription?.space?.hid !== generalTutorActiveSpace?.hid
                                                    ) {
                                                        generalTutorGetLessonList(setError, space_subscription?.space?.hid)
                                                        setActiveGeneralTutorSpace(space_subscription?.space)
                                                    }
                                                }}
                                                key={`space_${space_subscription?.space?.hid}`}
                                            >
                                                <MessagesSquare className="!w-[12px] !h-[12px] mt-auto mb-auto" />
                                                <span
                                                    className="mt-auto mb-auto text-[11px] w-full overflow-hidden"
                                                    style={{
                                                        WebkitMaskImage: "linear-gradient(90deg, black 70%, transparent 100%)",
                                                        maskImage: "linear-gradient(90deg, black 70%, transparent 100%)",
                                                    }}
                                                >
                                                    {space_subscription?.space?.name}
                                                </span>
                                            </Button>
                                        )
                                    ))}
                                </>
                            )}

                        </AccordionContent>
                    </div>
                </AccordionItem>
            </Accordion >
        </>
    )
}
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
                                > Erase Case</Button>
                            </AlertDialogCancel>
                        </div>
                        <AlertDialogCancel className=''>Cancel</AlertDialogCancel>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
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
