"use client"
import { useAppStore } from "@/stores/appStore"
import { BookText, ChevronDown, CircleCheck, CircleDashed, CirclePlus, CircleX, Crown, Delete, BriefcaseBusiness, Hourglass, Loader2, LogOut, MessagesSquare, PanelRightClose, Share2, Trash, UserPlus } from "lucide-react"
import { useShallow } from "zustand/shallow"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
import { SubmitHandler, useForm } from "react-hook-form"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserStore } from "@/stores/userStore"
import { z } from "zod"
import InlineAlertComponent, { handleAlertColors } from "./errors"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Separator } from "./ui/separator"
import { useGeneralTutorStore } from "@/stores/generalTutorStore"
import { ScrollTopChatPage } from "./scrollToTop"
import { useSourceStore } from "@/stores/sourceStore"

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
                            This will erase this thread space, your progress
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
                                > Erase Space</Button>
                            </AlertDialogCancel>
                        </div>
                        <AlertDialogCancel className=''>Cancel</AlertDialogCancel>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function DeleteThread(props: { general_tutor_lesson: any, space_hid: string }) {
    const {
        generalTutorDeleteLesson,
        generalTutorLoading,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorDeleteLesson: state.generalTutorDeleteLesson,
            generalTutorLoading: state.loading,
        })),
    )

    const [open, setOpen] = useState(false)

    const { setError } = useForm<any>({})
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <Delete
                size={20}
                className="hover:cursor-pointer text-destructive/75 hover:text-destructive ml-1"
                onClick={() => setOpen(!open)}
            />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className='text-primary'>
                            This will permanently remove this lesson, and lesson
                            data will be erased.
                        </span>
                        <br />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className='w-full flex flex-row justify-between my-4'>
                        <div className='w-40'>
                            {generalTutorLoading.generalTutorDeleteLesson ? (
                                <Button disabled className="w-full ">
                                    <Loader2 className="animate-spin" />
                                </Button>
                            ) : (
                                <Button
                                    type='submit'
                                    className='w-full text-destructive'
                                    onClick={
                                        () => {
                                            generalTutorDeleteLesson(
                                                setError,
                                                props.general_tutor_lesson.hid,
                                                props.space_hid,
                                            )
                                        }

                                    }
                                > Remove Reading</Button>
                            )}
                        </div>
                        <AlertDialogCancel
                            className=''
                        >Cancel</AlertDialogCancel>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function ThreadsSheet(props: { type: number, space: any }) {
    // Extract state from your stores
    const { isMdScreen, appSetShowSideBar } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
            appSetShowSideBar: state.setShowSideBar,
        })),
    )
    const {
        generalTutorLessonList,
        generalTutorInfinteScroll,
        generalTutorGetLessonPage,
        generalTutorActiveLesson,
        generalTutorLessonCounts,
        setGeneralTutorActiveLesson,
        generalTutorGetLesson,
        setActiveGeneralTutorSpace,
        generalTutorUpdateLesson,
        generalTutorLesson,
        generalTutorLoading,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorLessonCounts: state.generalTutorLessonCounts,
            generalTutorLessonList: state.generalTutorLessonList,
            generalTutorInfinteScroll: state.generalTutorInfinteScroll,
            generalTutorGetLessonPage: state.generalTutorGetLessonPage,
            generalTutorActiveLesson: state.generalTutorActiveLesson,
            setGeneralTutorActiveLesson: state.setGeneralTutorActiveLesson,
            generalTutorGetLesson: state.generalTutorGetLesson,
            setActiveGeneralTutorSpace: state.setActiveGeneralTutorSpace,
            generalTutorUpdateLesson: state.generalTutorUpdateLesson,
            generalTutorLesson: state.generalTutorLesson,
            generalTutorLoading: state.loading,
        })),
    )
    const navigate = useNavigate()

    // Use a typed ref for the scrollable container
    const divRef = useRef<HTMLDivElement>(null)

    const { setError } = useForm<any>()

    // Load more content only if there is more data and a page is not already loading
    const loadMoreContent = () => {
        if (generalTutorInfinteScroll.hasMore && !generalTutorLoading.generalTutorGetLessonPage) {
            const next_page = generalTutorInfinteScroll.nextPage && generalTutorInfinteScroll.nextPage > 1 ? generalTutorInfinteScroll.nextPage : 2
            generalTutorGetLessonPage(setError, props.space.hid, next_page)
        }
    }

    // On scroll, if the user is near the bottom (within 5px), load more content.
    const handleScroll = () => {
        const div = divRef.current
        if (div) {
            const { scrollTop, scrollHeight, clientHeight } = div
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                loadMoreContent()
            }
        }
    }

    // After each render (or when the lesson list updates), check whether the container's
    // content fills the available space. If not, load more data automatically.
    const checkContentFill = () => {
        const div = divRef.current
        if (div) {
            // If the total content height is less than (or equal to) the container height plus a small threshold,
            // and if there is more content to load, then load another page.
            if (div.scrollHeight <= div.clientHeight && generalTutorInfinteScroll.hasMore && !generalTutorLoading.generalTutorGetLessonPage) {
                loadMoreContent()
            }
        }
    }
    useEffect(() => {
        checkContentFill()
        // You might also want to listen for window resize events if your layout is dynamic.
    }, [generalTutorLessonList, generalTutorInfinteScroll.hasMore, generalTutorLoading.generalTutorGetLessonPage, divRef.current])

    return (
        <div
            id="scrollableDiv"
            ref={divRef}
            onScroll={handleScroll}
            data-focus-lock-disabled
        >
            <div>
                <div className='w-full flex flex gap-2 justify-between'>
                    <Button
                        variant="outline"
                        size="icon"
                        className='w-full w-16 text-center flex flex-row justify-center bg-transparent !text-sm relative text-primary border border-primary'
                        onClick={
                            () => {
                                setActiveGeneralTutorSpace(null)

                                useGeneralTutorStore.setState(() => ({
                                    generalTutorLesson: {},
                                    generalTutorActiveLesson: null
                                }));
                                navigate('/')
                            }
                        }
                    >
                        <div className='flex flex-row'>
                            <LogOut
                                className="!w-[12px] !h-[12px] mt-auto mb-auto m-auto mr-1 rotate-180 stroke-red-500" /> Exit
                        </div>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className='w-full w-fit text-center flex flex-row justify-center bg-transparent !text-sm relative text-primary border border-primary'
                        onClick={
                            () => {
                                navigate(`/share_space/${props?.space?.name}/${props?.space?.hid}`)
                            }
                        }
                    >
                        <div className='flex flex-row'>
                            <Share2
                                className="!w-[12px] !h-[12px] mt-auto mb-auto m-auto mr-1 stroke-blue-500" /> Share
                        </div>
                    </Button>
                </div>
                <Separator className="my-2" />
                <div className='flex flex-row w-full justify-between'>
                    <span className='mt-2 mb-4 text-lg semi-bold m-auto'>
                        {props?.space?.name}
                    </span>
                </div>
                <div className='border mb-4 p-2 rounded-2xl border-primary/5'>
                    <>
                        <div className="flex flex-row w-full text-[10px] text-primary mt-2 mb-1 justify-center">
                            <div className="flex flex-row m-m-0 mr-2">
                                <BookText size={16} className="mt-auto mb-auto mr-1 stroke-primary" />
                                {generalTutorLessonCounts.total_lessons} Total
                            </div>
                            <div className="flex flex-row m-m-0 mr-2">
                                <Hourglass size={16} className='mt-auto mb-auto mr-1 stroke-cyan-500' />
                                {String(
                                    generalTutorLessonCounts.total_lessons -
                                    Number(generalTutorLessonCounts.completed_lessons),
                                )} Pending
                            </div>
                            <div className="flex flex-row m-m-0 mr-2">
                                <Crown size={16} className='mt-auto mb-auto mr-1 stroke-yellow-400' />
                                {String(generalTutorLessonCounts.completed_lessons)} Done
                            </div>
                        </div>
                        <Progress value={
                            ((generalTutorLessonCounts.completed_lessons) / (generalTutorLessonCounts.total_lessons)) * 100
                        }
                            className='!h-[3px] !w-[85%] m-auto mt-2'
                        />
                    </>
                </div>
            </div>
            <div className='mb-4'>
                <Button
                    variant="outline"
                    size="icon"
                    className={`text-center !w-[90%] m-auto !p-4 flex flex-row justify-start bg-transparent !text-sm relative text-primary`}
                    onClick={(event) => {
                        event?.preventDefault()
                        event.stopPropagation()
                        navigate('/new_reading')
                        if (isMdScreen) {
                            appSetShowSideBar(false)
                        }
                    }}
                >
                    <div className='flex flex-row text-md text-primary/85'>
                        <CirclePlus
                            className="!w-[18px] !h-[18px] mt-auto mb-auto m-auto stroke-primary mr-2"
                        />
                        <span className='mt-auto mb-auto'>New Reading</span>
                    </div>
                </Button>
            </div>
            <div>
                {generalTutorLoading.generalTutorCreateLesson && (<Loader2 className='m-auto animate-spin w-4 h-4 mt-2' />)}
                {generalTutorLessonList.map((general_tutor_lesson, index) => (
                    <div className="py-1 text-sm" key={`GeneralTutorLesson_item_${index}`}>
                        <div>
                            <div
                                onClick={() => {
                                    setGeneralTutorActiveLesson(general_tutor_lesson.hid)
                                    if (
                                        !('hid' in generalTutorLesson) ||
                                        ('hid' in generalTutorLesson && generalTutorLesson.hid !== general_tutor_lesson.hid)
                                    ) {
                                        generalTutorGetLesson(setError, general_tutor_lesson.hid).then(() => {
                                            ScrollTopChatPage()
                                        })
                                    }
                                    if (isMdScreen) {
                                        appSetShowSideBar(false)
                                    }
                                    navigate('/space')
                                }}
                                className={`
                                        relative
                                        ml-1
                                        font-medium
                                        border-l
                                        border-primary
                                        text-primary/75
                                        ${generalTutorActiveLesson === general_tutor_lesson.hid
                                        ? '!bg-white/15 text-primary'
                                        : 'hover:!text-primary'
                                    }
                                        overflow-scroll flex flex-row items-center p-1 scrollbar-hide
                                        cursor-pointer
                                        rounded-r-md
                                      `}
                            >
                                <div className="flex flex-row w-[95%]">
                                    {generalTutorLoading.generalTutorUpdateLesson && generalTutorActiveLesson === general_tutor_lesson.hid ? (
                                        <Loader2 className="animate-spin mr-[5px] stroke-primary  mt-auto mb-auto" size={15} />
                                    ) : (
                                        'completed' in general_tutor_lesson && general_tutor_lesson.completed ? (
                                            <Crown className="mr-[5px] stroke-yellow-400 mt-auto mb-auto" size={15} />
                                        ) : (
                                            <CircleDashed className="mr-[5px] stroke-primary mt-auto mb-auto" size={15} />
                                        )
                                    )}
                                    <span
                                        className="w-full overflow-hidden text-nowrap"
                                        style={{
                                            WebkitMaskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                            maskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                        }}
                                    >
                                        {'lessontitle' in general_tutor_lesson && general_tutor_lesson.lessontitle
                                            ? general_tutor_lesson.lessontitle
                                            : general_tutor_lesson.query}
                                    </span>
                                </div>
                                {generalTutorActiveLesson === general_tutor_lesson.hid ? (
                                    <div className="basis-2/12 flex justify-end align-right absolute right-0 mr-2">
                                        {'completed' in general_tutor_lesson &&
                                            (general_tutor_lesson.completed ? (
                                                <CircleX
                                                    size={20}
                                                    className="hover:cursor-pointer text-gray-400 hover:text-gray-200"
                                                    onClick={(event) => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        generalTutorUpdateLesson(
                                                            setError,
                                                            general_tutor_lesson.hid,
                                                            { ...general_tutor_lesson, completed: false },
                                                        )
                                                    }}
                                                />
                                            ) : (
                                                <CircleCheck
                                                    size={20}
                                                    className="hover:cursor-pointer text-success/75 hover:text-success"
                                                    onClick={(event) => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        generalTutorUpdateLesson(
                                                            setError,
                                                            general_tutor_lesson.hid,
                                                            { ...general_tutor_lesson, completed: true },
                                                        )
                                                    }}
                                                />
                                            ))}
                                        <DeleteThread general_tutor_lesson={general_tutor_lesson} space_hid={props?.space?.hid} />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))
                }
                {generalTutorLoading.generalTutorGetLessonPage || generalTutorLoading.generalTutorGetLessonList ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : (null)}
                {!generalTutorInfinteScroll.hasMore && (
                    <Separator className="my-2" />
                )}
            </div>
            <EraseSpace space_hid={props?.space?.hid} />
        </div>
    )
}

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
        getSources
    } = useSourceStore(
        useShallow((state) => ({
            getSources: state.getSources,
        })),
    )
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
                                                        getSources(setError, true, space_subscription?.space?.hid)
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

export function SideBar() {
    const { isMdScreen, appShowSideBar, appSetShowSideBar } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
            appShowSideBar: state.showSideBar,
            appSetShowSideBar: state.setShowSideBar,
        })),
    )
    const { auth } = useUserStore(
        useShallow((state) => ({
            auth: state.auth,
        })),
    )
    const {
        generalTutorGetSpaceSubscriptionList,
        generalTutorActiveSpace,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorGetLessonList: state.generalTutorGetLessonList,
            generalTutorGetSpaceSubscriptionList: state.generalTutorGetSpaceSubscriptionList,
            generalTutorLessonList: state.generalTutorLessonList,
            generalTutorLessonCounts: state.generalTutorLessonCounts,
            generalTutorActiveSpace: state.generalTutorActiveSpace,
        })),
    )
    const navigate = useNavigate()

    const { setError } = useForm<any>({})
    useEffect(() => {
        if (auth.hid) {
            generalTutorGetSpaceSubscriptionList(setError)
        }
    }, [auth])


    return (
        <>
            <div className='p-2 flex flex-col w-full h-full justify-start'>
                <div className='flex flex-col border-b border-primary/10 p-2 hover:cursor-pointer'
                    onClick={() => {
                        navigate('/')
                    }}
                >
                    <div className={'inline-flex items-end md:!hidden float-right absolute top-0 right-0'}>
                        <div
                            className={`p-1 w-4/4 p-2 flex items-center font-bold text-center cursor-pointer
								float-right
								text-xl
							`}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                appSetShowSideBar(appShowSideBar === false)
                            }}
                        >
                            <PanelRightClose />
                        </div>
                    </div>
                    <BriefcaseBusiness size={45} strokeWidth={1.75} absoluteStrokeWidth className='m-auto' />
                    <span className='m-auto text-[9px]'>PrepInterview</span>
                </div>
                <div className='p-1'>
                    {generalTutorActiveSpace ? (<ThreadsSheet type={1} space={generalTutorActiveSpace} />) : (
                        <>
                            {auth.hid && (
                                <>
                                    <SpacesList />
                                </>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className='w-full h-10 mt-1 text-start !p-2 flex flex-row justify-start bg-transparent hidden'
                                onClick={() => {
                                    navigate('/account/billing')
                                    if (isMdScreen) {
                                        appSetShowSideBar(false);
                                    }
                                }}
                            >
                                <UserPlus size={35} className="mt-auto mb-auto stroke-blue-500" /><span className="mt-auto mb-auto"> Upgrade to pro</span>
                            </Button>
                        </>
                    )}
                </div>
            </div >
        </>
    )
}
