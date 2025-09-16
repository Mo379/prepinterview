import { BookCheck, CircleSlash, CircleX, FileQuestion, FileSearch, BriefcaseBusiness, Globe, Image, Loader, Loader2, RefreshCcw, Share2, Type, Youtube } from "lucide-react";
import { ChatInput, SheetSources } from "@/components/chatinput";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SiteURL, useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useGeneralTutorStore } from "@/stores/generalTutorStore";
import { Skeleton } from "@nextui-org/react";
import { ConceptOutline, Slides } from "@/components/slides";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { FaFilePdf, FaRegFileWord } from "react-icons/fa6";
import { useSourceStore } from "@/stores/sourceStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleAlertColors } from "@/components/errors";

export function SpacesNewLesson() {
    const {
        isMdScreen
    } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
        })),
    )
    const {
        generalTutorCreateLesson,
        generalTutorActiveSpace,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorCreateLesson: state.generalTutorCreateLesson,
            generalTutorActiveSpace: state.generalTutorActiveSpace,
            generalTutorActiveLesson: state.generalTutorActiveLesson,
        })),
    )
    const { sources, getSources, sourceLoading } = useSourceStore(
        useShallow((state) => ({
            sources: state.sources,
            source_activation: state.source_activation,
            getSources: state.getSources,
            getSourceActivation: state.getSourceActivation,
            deleteSource: state.deleteSource,
            getSourceStatus: state.getSourceStatus,
            updateSourceLessonActivation: state.updateSourceLessonActivation,
            sourceLoading: state.loading,
        })),
    )
    const { setError } = useForm<any>()
    const [canStartRead, setCanStartRead] = useState<any>(false);
    const navigate = useNavigate()

    const FormSchema = z.object({
        reading_title: z.string().min(1, 'Please provide a reading title.'),
        source_hid: z.string().min(1, 'Please select one of the reading options.'),
    })
    type FormType = z.infer<typeof FormSchema>


    const { watch, setValue, register, handleSubmit, formState: { errors } } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })


    const onSubmit: SubmitHandler<FormType> = (data) => {
        if (generalTutorActiveSpace && data.source_hid && data.reading_title) {
            generalTutorCreateLesson(setError, generalTutorActiveSpace.hid, data.source_hid, data.reading_title)
            navigate('/space')
        }
    }

    const source_icon_style = 'w-5 h-5 mt-auto mb-auto'

    const readingTitle = watch("reading_title");
    const sourceHid = watch("source_hid");

    useEffect(() => {
        if (!readingTitle || !sourceHid || readingTitle.length < 1 || sourceHid.length < 1) {
            setCanStartRead(false);
            return;
        }
        setCanStartRead(true);
    }, [readingTitle, sourceHid]);

    return (
        (generalTutorActiveSpace && 'hid' in generalTutorActiveSpace) && (
            <div className='flex flex-row  m-auto !min-h-full !break-words text-pretty px-1 md:px-2 dark:text-primary/80 w-full'>
                <div className={`flex flex-col md:flex-row-reverse mx-auto text-xl  w-full ${isMdScreen ? ('p-0') : ("p-2 !justify-center")} gap-2`}>
                    <div className={`
                        flex flex-col justify-between text-break text-wrap w-[min(98%,900px)] mx-auto min-h-[105vh]
                        `}
                    >
                        <div className={`flex flex-col justify-between`}>
                            <div className='text-center !w-full'>
                                <BriefcaseBusiness className="m-auto" size={35} />
                                <span>{generalTutorActiveSpace?.name}</span>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className='w-[90%] md:w-[75%] mt-24 mx-auto'>
                                <h1 className='w-full text-center text-3xl m-auto mb-4'> What are you reading next ?</h1>
                                <div
                                    className={``}
                                >
                                    <div className='w-full flex flex-col md:flex-row justify-center gap-2 mb-8'>
                                        <Button
                                            type='submit'
                                            className='!w-44 m-auto md:m-0'
                                            variant={'default'}
                                            disabled={!canStartRead}
                                        >
                                            <span>Start Prep!</span>
                                        </Button>
                                        <SheetSources is_general_tutor={true} object_hid={generalTutorActiveSpace?.hid} is_course_creator={true} hide_lesson_activations={true} />
                                    </div>
                                    <div className="grid gap-2 mb-4">
                                        <Label htmlFor="email" className={`mb-2 text-${errors.reading_title && handleAlertColors(errors.reading_title)}`} >Reading Title</Label>
                                        <Input
                                            type="text"
                                            placeholder="Title of this reading..."
                                            {...register("reading_title", { required: true })}
                                            className={`w-[85%] md:w-[40%] border border-${errors.reading_title && handleAlertColors(errors.reading_title)
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            value={watch("reading_title") || ""} // controlled by RHF
                                            onChange={(e) => setValue("reading_title", e.target.value)} // update RHF state
                                        />
                                    </div>
                                </div >
                                {sourceLoading.getSources ? (<Skeleton className='w-[90%] min-h-[30vh] rounded-xl' />) : (
                                    <Table className={`border border-${errors.source_hid && handleAlertColors(errors.source_hid)} mb-44`}>
                                        <TableCaption></TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="flex flex-row justify-between">
                                                    <span className='mt-auto mb-auto'>Reading Options</span>
                                                    <Button
                                                        type='submit'
                                                        className='!w-fit mt-auto mb-auto'
                                                        variant={'outline'}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            e.preventDefault()
                                                            getSources(setError, true, generalTutorActiveSpace?.hid)
                                                        }}
                                                    >
                                                        <RefreshCcw className='!w-8 mt-auto mb-auto' />
                                                    </Button>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sourceLoading.getSources || sourceLoading.uploadSource ? (
                                                <TableRow >
                                                    <TableCell><Skeleton className='h-[35px] rounded-xl w-fit' /></TableCell>
                                                </TableRow>
                                            ) : (null)}
                                            {sources?.source_list?.map((source: any) => (
                                                <TableRow key={`source-list-${source.hid}`}>
                                                    <TableCell
                                                        className="flex flex-row gap-2 font-medium text-primary/60 hover:text-primary justify-between"
                                                    >
                                                        <div className='flex flex-row gap-4'>
                                                            {source.source_type === 'PDF' && (<FaFilePdf className={`${source_icon_style} text-red-700`} />)}
                                                            {source.source_type === 'WORD' && (<FaRegFileWord className={`${source_icon_style} text-blue-400`} />)}
                                                            {source.source_type === 'TEXT' && (<Type className={`${source_icon_style} stroke-primary`} />)}
                                                            {source.source_type === 'WEB' && (<Globe className={`${source_icon_style} stroke-primary`} />)}
                                                            {source.source_type === 'WEBDOC' && (<FileSearch className={`${source_icon_style} stroke-primary`} />)}
                                                            {source.source_type === 'Youtube' && (<Youtube className={`${source_icon_style} stroke-red-600`} />)}
                                                            {source.source_type === 'IMG' && (<Image className={`${source_icon_style} stroke-green-600`} />)}
                                                            {!source.source_type && (<FileQuestion className={`${source_icon_style} stroke-primary/25`} />)}
                                                            <Button
                                                                variant={watch("source_hid") === source.hid ? "default" : "outline"}
                                                                className="mt-auto mb-auto hover:cursor-pointer"
                                                                disabled={source.processing_status !== 'pipeline_completed' || !(['PDF', 'WORD', 'WEBDOC'].includes(source.source_type))}
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                    if (watch("source_hid") === source.hid) {
                                                                        setValue("source_hid", ""); // deselect
                                                                    } else {
                                                                        setValue("source_hid", source.hid); // select
                                                                    }
                                                                }}
                                                            >
                                                                {source.name}
                                                            </Button>
                                                        </div>
                                                        {!source.pipeline_uploaded ? (
                                                            <>
                                                                <Loader2 className='animate-spin mt-auto mb-auto' />
                                                            </>
                                                        ) : (
                                                            !(['PDF', 'WORD', 'WEBDOC'].includes(source.source_type)) ? (
                                                                <span className='mt-auto mb-auto'>context only (not a document!)</span>
                                                            ) : (
                                                                <>
                                                                    {source.processing_status === 'pipeline_started' && (
                                                                        <>
                                                                            <span className='mt-auto mb-auto'>Processing...</span><Loader className='animate-spin mt-auto mb-auto' />
                                                                        </>
                                                                    )}
                                                                    {source.processing_status === 'pipeline_completed' && (
                                                                        <BookCheck className='stroke-green-600/80 mt-auto mb-auto' />
                                                                    )}
                                                                    {source.processing_status === 'pipeline_pending' && (
                                                                        <CircleSlash className='mt-auto mb-auto' />
                                                                    )}
                                                                    {source.processing_status === 'pipeline_failed' && (
                                                                        <CircleX className='mt-auto mb-auto stroke-red-400' />
                                                                    )}
                                                                </>
                                                            ))}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}
export function Spaces() {
    const {
        isMdScreen, showSideBar
    } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
            showSideBar: state.showSideBar,
        })),
    )
    const {
        auth,
    } = useUserStore(
        useShallow((state) => ({
            auth: state.auth
        })),
    )
    const {
        learningMode,
        generalTutorActiveLesson,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            learningMode: state.learningMode,
            generalTutorActiveLesson: state.generalTutorActiveLesson,
        })),
    )

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
                            {learningMode === 'concepts' && (
                                <ConceptOutline />
                            )}
                            {learningMode === 'reading' && (
                                <Slides />
                            )}
                        </div>
                    </div>
                    {(auth.hid && generalTutorActiveLesson) && (
                        <div className={`
                                    w-full
                                   ${isMdScreen ? (
                                "sticky bottom-0 !mb-0"
                            ) : (
                                "sticky bottom-0 !mb-0"
                            )}
                                    ${isMdScreen && showSideBar ? 'hidden' : 'flex'}
                                    justify-center mx-auto
                                    z-50
                                    `}
                        >
                            <ChatInput
                                is_general_tutor={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export function ShareSpace() {
    const {
        auth,
    } = useUserStore(
        useShallow((state) => ({
            auth: state.auth,
        })),
    )
    const {
        generalTutorSpaceEnableSharing,
        generalTutorActiveSpace,
        generalTutorLoading
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorSpaceEnableSharing: state.generalTutorSpaceEnableSharing,
            generalTutorActiveSpace: state.generalTutorActiveSpace,
            generalTutorLoading: state.loading,
        })),
    )
    const { setError } = useForm<any>()

    const { space_name, space_hid } = useParams();
    return (
        <section className="flex flex-row place-items-center py-8 md:py-8">
            <div className="text-center lg:text-start space-y-2 m-auto">
                <main className="text-2xl md:text-6xl font-bold">
                    <div className='flex flex-col m-auto justify-center'>
                        <Share2 strokeWidth={0.55} absoluteStrokeWidth className='m-auto w-[150px] h-[150px] md:w-[200px] md:h-[200px]' />
                        <div className='text-3xl text-center mb-8'>
                            <br />
                            <span className='text-ring text-center/25'>
                                Space: {space_name}
                            </span>
                            <br />
                            {(
                                auth &&
                                'hid' in auth &&
                                generalTutorActiveSpace &&
                                !generalTutorActiveSpace.is_open &&
                                generalTutorActiveSpace.hid === space_hid &&
                                generalTutorActiveSpace.owner_hid === auth.hid
                            ) ? (
                                <div className='flex flex-col w-full justify-center gap-4'>
                                    <Button variant="default" size="icon" className='mt-auto mb-auto w-fit m-auto text-2xl p-12 mt-8'
                                        onClick={() => {
                                            if (space_hid) {
                                                generalTutorSpaceEnableSharing(setError, space_hid)
                                            }
                                        }}
                                        disabled={generalTutorLoading.generalTutorSpaceEnableSharing}
                                    >
                                        {generalTutorLoading.generalTutorSpaceEnableSharing ? (
                                            <Loader2 className='animate-spin' />
                                        ) : (
                                            <>
                                                Open Sharing
                                            </>
                                        )}
                                    </Button>
                                    <span className='text-ring text-center/25 text-[18px] mt-8'>
                                        Warning: Once sharing is opened, a space cannot be closed and anyone with the link can join!
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <span className='text-ring text-center/25 text-[18px] mt-8'>
                                        Copy and share this link
                                    </span>
                                    <br />
                                    <span className='text-ring text-center/25 text-[18px]'>
                                        {`${SiteURL}/join_space/${space_name}/${space_hid}`}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </main>

            </div>
        </section>
    )
}
export function JoinSpace() {
    const {
        setShowSideBar,
    } = useAppStore(
        useShallow((state) => ({
            setShowSideBar: state.setShowSideBar,
        })),
    )
    const {
        generalTutorJoinSpace,
        generalTutorLoading,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorJoinSpace: state.generalTutorJoinSpace,
            generalTutorLoading: state.loading,
        })),
    )
    const navigate = useNavigate()
    const { setError } = useForm<any>()

    const { space_name, space_hid } = useParams();
    useEffect(() => {
        setShowSideBar(false)
    }, [])
    return (
        <section className="flex flex-row place-items-center py-8 md:py-8">
            <div className="text-center lg:text-start space-y-2 m-auto">
                <main className="text-2xl md:text-6xl font-bold">
                    <div className='flex flex-col m-auto justify-center'>
                        <Share2 strokeWidth={0.55} absoluteStrokeWidth className='m-auto w-[150px] h-[150px] md:w-[200px] md:h-[200px]' />
                        <div className='text-3xl text-center mb-8'>
                            <br />
                            <span className='text-ring text-center/25'>
                                Space: {space_name}
                            </span>
                            <br />
                            <div className='flex flex-col md:flex-row w-full justify-center gap-4'>
                                <Button variant="default" size="icon" className='mt-auto mb-auto w-fit m-auto text-2xl p-12 mt-8'
                                    onClick={() => {
                                        if (space_hid) {
                                            generalTutorJoinSpace(setError, space_hid).then(() => {
                                                setShowSideBar(true)
                                                navigate('/')
                                            })
                                        }
                                    }}
                                    disabled={generalTutorLoading.generalTutorJoinSpace}
                                >
                                    {generalTutorLoading.generalTutorJoinSpace ? (
                                        <Loader2 className='animate-spin' />
                                    ) : (
                                        <>
                                            Join Space
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </section>
    )
}
