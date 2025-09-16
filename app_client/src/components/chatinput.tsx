import { Baby, Blocks, BookCheck, BookOpen, CircleSlash, CircleX, ClipboardList, Command, FilePlus, FileQuestion, FileSearch, GitPullRequestCreateArrow, Globe, HardDrive, HeartCrack, Image, KeyRound, Link, ListCollapse, Loader, Loader2, Lock, LockKeyholeOpen, MoveRight, Rabbit, RefreshCcw, Settings, Shapes, ShieldCheck, SquareLibrary, Target, Trash, Type, Upload, X, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useShallow } from "zustand/shallow";
import { useAppStore } from "@/stores/appStore";

import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Pulsing } from "./pulsing";
import { z } from "zod";
import { Checkbox, Skeleton } from "@nextui-org/react";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight';

import { useGeneralTutorStore } from "@/stores/generalTutorStore";
import { useStreamStore } from "@/stores/streamStore";
import { Progress } from "./ui/progress";
import { DocsPicker, FileUploader, SourceDocumentUrl, SourceRawText, SourceWebsiteUrl } from "./add_sources";
import { useSourceStore } from "@/stores/sourceStore";
import { FaFilePdf, FaRegFileWord } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatMath } from "@/stores/serviceStore";
import { InlineCitation, SlidesProgressDisplay } from "./slides";
import rehypeRaw from "rehype-raw";
import { useNoteStore } from "@/stores/noteStore";


export const button_style = 'hover:bg-primary/10 mr-1 md:mr-2 rounded-full p-[4px] md:p-[8px] hover:cursor-pointer mt-auto mb-auto'
export const icon_style = "!w-[28px] !h-[28px] md:!h-[28px] md:!w-[28px] shrink-0 transition-transform duration-200 stroke-primary p-[2px]"


export function SheetSources(props: { is_general_tutor: boolean, object_hid: string, is_course_creator?: boolean, is_lesson_outline?: boolean, lessonKey?: string, sheetOpen?: any, setSheetOpen?: any, hide_lesson_activations?: boolean }) {
    const {
        isMdScreen
    } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
        })),
    )
    const { generalTutorActiveLesson } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorActiveLesson: state.generalTutorActiveLesson,
        })),
    )
    const { sources, source_activation, getSources, getSourceActivation, deleteSource, getSourceStatus, updateSourceActivation, updateSourceLessonActivation, sourceLoading } = useSourceStore(
        useShallow((state) => ({
            sources: state.sources,
            source_activation: state.source_activation,
            getSources: state.getSources,
            getSourceActivation: state.getSourceActivation,
            deleteSource: state.deleteSource,
            getSourceStatus: state.getSourceStatus,
            updateSourceActivation: state.updateSourceActivation,
            updateSourceLessonActivation: state.updateSourceLessonActivation,
            sourceLoading: state.loading,
        })),
    )
    const [open, setOpen] = useState(false)
    const [openInput, setOpenInput] = useState<any | null>(null)
    const [openDeleteSource, setOpenDeleteSource] = useState<any | null>(null)
    let [sheetOpen, setSheetOpen] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<any | null>({}); // 0–100
    const [lessonKey, setLessonKey] = useState<string>(String(props.lessonKey)); // 0–100

    if (props.sheetOpen && props.setSheetOpen) {
        sheetOpen = props.sheetOpen
        setSheetOpen = props.setSheetOpen
    }

    const source_icon_style = 'w-5 h-5 mt-auto mb-auto'

    const sourceDeleteFormSchema = z.object({
        confirm: z.boolean(),
        source_hid: z.string(),
    })
    type sourceDeleteFormType = z.infer<typeof sourceDeleteFormSchema>
    const { watch, reset, setValue, handleSubmit, control, setError } = useForm<sourceDeleteFormType>(
        { resolver: zodResolver(sourceDeleteFormSchema) }
    )
    const onSubmit: SubmitHandler<sourceDeleteFormType> = (data) => {
        if (data.confirm && data.source_hid) {
            deleteSource(
                setError,
                data.source_hid,
            )
        }
        reset()
    }
    useEffect(() => {
        // Check if any source has `processing_status === 'pipeline_started'`
        const hasPipelineStarted = sources?.source_list?.some(
            (s: any) => s.processing_status === 'pipeline_started'
        )

        if (!hasPipelineStarted) return; // No need to poll if none are started

        const interval = setInterval(() => {
            getSourceStatus(setError, props.is_general_tutor, props.object_hid)
        }, 2500)

        return () => clearInterval(interval)
    }, [
        sources?.source_list,
        props.is_general_tutor,
        props.object_hid,
        getSourceStatus,
    ])

    useEffect(() => {
        if (!props.is_lesson_outline) {
            if (props.is_general_tutor) {
                setLessonKey(generalTutorActiveLesson ? generalTutorActiveLesson : '')
            }
        }
    }, [generalTutorActiveLesson])
    useEffect(() => {
        if (props.lessonKey) {
            setLessonKey(props.lessonKey)
        }
    }, [props.lessonKey])

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            {props.is_course_creator ? (
                props.is_lesson_outline ? (
                    null
                ) : (
                    <Button
                        variant="default"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (props.object_hid) {
                                if (!sheetOpen) { setSheetOpen(true) }
                                getSources(setError, props.is_general_tutor, props.object_hid)
                                getSourceActivation(setError, props.is_general_tutor, props.object_hid, lessonKey)
                            }
                        }}
                        className='w-fit text-sm md:text-md m-auto md:m-0'
                    >
                        <SquareLibrary size={14} className={`!stroke-secondary !h-4 !w-4`} />
                        Add Sources
                    </Button>
                )
            ) : (
                <span className={`${button_style} ml-1 flex flex-row`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (props.object_hid) {
                            if (!sheetOpen) { setSheetOpen(true) }
                            getSources(setError, props.is_general_tutor, props.object_hid)
                            getSourceActivation(setError, props.is_general_tutor, props.object_hid, lessonKey)
                        }
                    }}
                >
                    <SquareLibrary size={14} className={`${icon_style} !stroke-blue-500`} />
                </span>
            )}
            <SheetContent hideClose={false} className={`${isMdScreen ? '!min-w-full' : '!min-w-[85dvw]'} flex flex-col justify-start !min-h-[100%] max-h-[100%] gap-0`}>
                <SheetHeader>
                    <SheetTitle className='flex flex-row'><GitPullRequestCreateArrow size={45} className='!w-6 !h-6 mr-2' />Sources</SheetTitle>
                    <SheetDescription>
                        Add and modify your sources, this will guide the model to create accurate information.
                    </SheetDescription>
                    <div className='flex flex-row w-full flex-wrap gap-2 justify-start mt-4'>
                        <Button className={`text-md !p-[10px] !h-auto mt-3 ml-4 ${open && 'hidden'}`} variant={'default'} onClick={() => {
                            setOpen(open !== true)
                        }}>
                            <GitPullRequestCreateArrow size={45} className='!w-6 !h-6' /> Add New Sources
                        </Button>
                    </div>

                </SheetHeader>
                <div>
                    <div className={`
                        flex flex-col w-full justify-center text-center mt-4
                        ${!open && 'hidden'} h-fit
                        overflow-scroll scrollbar-hide p-4
                        border border-primary/20 rounded-2xl
                        mb-[80px]
                    `}>
                        <FileUploader setOpenParent={setOpen} is_general_tutor={props.is_general_tutor} object_hid={props.object_hid}
                            uploadProgress={uploadProgress} setUploadProgress={setUploadProgress}
                        />
                        <div className={`
                            flex ${isMdScreen ? 'flex-col w-full' : 'flex-row'} justify-center
                            m-auto gap-2 mt-2
                            ${openInput ? 'w-[80%]' : 'w-fit'}
                        `}>
                            {!openInput ? (
                                <>
                                    <div className={`
                                        flex flex-row justify-start
                                        border border-primary/20 min-h-fit
                                        ${isMdScreen ? 'w-[85%] mt-4' : 'w-fit'}
                                        m-auto rounded-xl p-4
                                        `}>
                                        <div className='flex flex-col'>
                                            <div className='flex flex-row text-sm text-primary/65'>
                                                <Link className='w-4 h-4 mt-auto mb-auto' />
                                                <span className='mt-auto mb-auto ml-2'>
                                                    Link
                                                </span>
                                            </div>
                                            <div className={`flex flex-row gap-1 ${isMdScreen ? 'flex-row flex-wrap' : 'flex-row'}`}>
                                                <Button type='button' className='w-fit h-8 rounded-full mt-4' variant={'ghost'} onClick={() => setOpenInput('website')}>
                                                    <Globe /> Web Page
                                                </Button>
                                                <Button type='button' className='w-fit h-8 rounded-full mt-4' variant={'ghost'} onClick={() => setOpenInput('documenturl')}>
                                                    <FilePlus /> Document URL
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`
                                        flex flex-row justify-start
                                        border border-primary/20 min-h-fit
                                        ${isMdScreen ? 'w-[85%]' : 'w-fit'}
                                        m-auto rounded-xl p-4
                                        `}>
                                        <div className='flex flex-col'>
                                            <div className='flex flex-row text-sm text-primary/65'>
                                                <ClipboardList />
                                                <span className='mt-auto mb-auto ml-2'>
                                                    Raw Text
                                                </span>
                                            </div>
                                            <Button type='button' className='w-fit h-8 rounded-full mt-4' variant={'ghost'} onClick={() => setOpenInput('text')}>
                                                <Upload /> Paste text
                                            </Button>
                                        </div>
                                    </div>
                                    <div className={`
                                        flex flex-row justify-start
                                        border border-primary/20 min-h-[90px]
                                        m-auto rounded-xl p-4
                                        ${isMdScreen ? 'w-[85%]' : 'w-fit'}
                                        `}>
                                        <div className='flex flex-col'>
                                            <div className='flex flex-row text-sm text-primary/65'>
                                                <HardDrive className='w-4 h-4 mt-auto mb-auto' />
                                                <span className='mt-auto mb-auto ml-2'>
                                                    Google Drive
                                                </span>
                                            </div>
                                            <div className="flex flex-row gap-1">
                                                <DocsPicker open={sheetOpen} setOpen={setSheetOpen} setOpenParent={setOpen} is_general_tutor={props.is_general_tutor} object_hid={props.object_hid}
                                                    uploadProgress={uploadProgress} setUploadProgress={setUploadProgress}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='!min-w-full'>
                                    {openInput === 'website' && (
                                        <SourceWebsiteUrl setOpen={setOpenInput} setOpenParent={setOpen} is_general_tutor={props.is_general_tutor} object_hid={props.object_hid} />
                                    )}
                                    {openInput === 'documenturl' && (
                                        <SourceDocumentUrl setOpen={setOpenInput} setOpenParent={setOpen} is_general_tutor={props.is_general_tutor} object_hid={props.object_hid}
                                            uploadProgress={uploadProgress} setUploadProgress={setUploadProgress}
                                        />
                                    )}
                                    {openInput === 'text' && (
                                        <SourceRawText setOpen={setOpenInput} setOpenParent={setOpen} is_general_tutor={props.is_general_tutor} object_hid={props.object_hid} />
                                    )}
                                </div>
                            )}
                        </div>
                        <span className='mt-4'> Max size: 50MB per file</span>
                        <Button type='button' className='block w-44 ml-auto mt-2' variant={'destructive'} onClick={() => setOpen(false)}> Close </Button>
                    </div>
                    <div className={`
                        flex flex-row justify-center
                        min-w-full mt-8
                        m-auto gap-2
                        justify-self-end
                    `}>
                        <div className={`
                            flex flex-row justify-start
                            border border-primary/20 min-w-[85%] h-fit
                            m-auto rounded-xl p-2 gap-3 justify-between
                            `}>
                            <div className='flex flex-row text-sm text-primary/65'>
                                <HardDrive className='w-4 h-4 mt-auto mb-auto' />
                                <span className='mt-auto mb-auto ml-2'>
                                    Source Limit
                                </span>
                            </div>
                            {sourceLoading.getSources ? (
                                <>
                                    <Skeleton className='w-[75%] mt-auto mb-auto h-2 rounded-xl' />
                                    <span className='mt-auto mb-auto'>
                                        <Skeleton className='w-8 mt-auto mb-auto h-2 rounded-xl' />
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Progress value={sources?.source_list?.length} className='w-[75%] mt-auto mb-auto h-2' />
                                    <span className='mt-auto mb-auto'>
                                        {sources?.source_list?.length ? sources?.source_list?.length : 0}/100
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    {lessonKey === source_activation.lesson_key && (
                        <span className={'flex justify-center text-center m-auto !w-full mt-8 text-xl text-primary/85 '}>
                            {source_activation.lesson_key.split('_')[0] + ' | '}
                            {source_activation.lesson_key.split('_')[1]}
                        </span>
                    )}
                    <div className={`
                        flex flex-row w-full justify-center mt-4
                        max-h-[90%]
                        overflow-scroll scrollbar-hide p-2
                        mb-[48px]
                    `}>
                        {sourceLoading.getSources ? (<Skeleton className='w-[90%] min-h-[30vh] rounded-xl' />) : (
                            <Table>
                                <TableCaption></TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="">Name</TableHead>
                                        <TableHead className="text-right">
                                            <Button
                                                type='submit'
                                                className='!w-fit ml-2'
                                                onClick={() => {
                                                    getSources(setError, props.is_general_tutor, props.object_hid)
                                                    getSourceActivation(setError, props.is_general_tutor, props.object_hid, lessonKey)
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
                                            <TableCell><Skeleton className='w-full h-[35px] rounded-xl' /></TableCell>
                                            <TableCell className="flex flex-row text-right justify-end"><Skeleton className='!w-44 h-[35px] rounded-xl' /></TableCell>
                                        </TableRow>
                                    ) : (null)}
                                    {sources?.source_list?.map((source: any) => (
                                        <TableRow key={`source-list-${source.hid}`}>
                                            <TableCell
                                                className="flex flex-row gap-2 font-medium text-primary/60 hover:text-primary"
                                            >
                                                {(!props.hide_lesson_activations) && (
                                                    <>
                                                        {source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.lesson_activation?.is_active}
                                                        <Checkbox
                                                            id={`source_activation_${source.hid}`}
                                                            isSelected={
                                                                source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.lesson_activation?.is_active ||
                                                                source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_global
                                                            }
                                                            isDisabled={
                                                                source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_global ||
                                                                source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_mandatory ||
                                                                (
                                                                    source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_mandatory &&
                                                                    !source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_owner
                                                                )
                                                            }
                                                            onChange={() => {
                                                                const index = source_activation.findIndex((item: any) => item.source_hid === source.hid)
                                                                const original_activation = source_activation[
                                                                    index
                                                                ]
                                                                const original_lesson_activation = original_activation.lesson_activation
                                                                const original_is_active = original_lesson_activation?.is_active
                                                                const new_is_active = original_is_active ? false : true

                                                                const updated_lesson_activation = {
                                                                    ...(original_activation || {}),  // carry over other properties if they exist
                                                                    lesson_activation: {
                                                                        ...(original_activation?.lesson_key || {}),
                                                                        is_active: new_is_active
                                                                    }
                                                                };

                                                                useSourceStore.setState(state => ({
                                                                    source_activation:
                                                                        index >= 0
                                                                            ? state.source_activation.map((item: any, i: any) => i === index ? updated_lesson_activation : item)
                                                                            : [...state.source_activation, updated_lesson_activation]
                                                                }));
                                                                updateSourceLessonActivation(setError, source.hid, lessonKey, new_is_active, original_activation)
                                                            }}
                                                            className='m-[2px]'
                                                        />
                                                    </>
                                                )}
                                                {source.source_type === 'PDF' && (<FaFilePdf className={`${source_icon_style} text-red-700`} />)}
                                                {source.source_type === 'WORD' && (<FaRegFileWord className={`${source_icon_style} text-blue-400`} />)}
                                                {source.source_type === 'TEXT' && (<Type className={`${source_icon_style} stroke-primary`} />)}
                                                {source.source_type === 'WEB' && (<Globe className={`${source_icon_style} stroke-primary`} />)}
                                                {source.source_type === 'WEBDOC' && (<FileSearch className={`${source_icon_style} stroke-primary`} />)}
                                                {source.source_type === 'Youtube' && (<Youtube className={`${source_icon_style} stroke-red-600`} />)}
                                                {source.source_type === 'IMG' && (<Image className={`${source_icon_style} stroke-green-600`} />)}
                                                {!source.source_type && (<FileQuestion className={`${source_icon_style} stroke-primary/25`} />)}
                                                <Button
                                                    variant='outline'
                                                    className='mt-auto mb-auto hover:cursor-pointer'
                                                    disabled
                                                >
                                                    {source.name}
                                                </Button>
                                                <div className='flex flex-row justify-end text-right w-full'>
                                                    <Button
                                                        type='submit'
                                                        className='!w-fit ml-2'
                                                        disabled={
                                                            source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_mandatory ||
                                                            (
                                                                source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_mandatory &&
                                                                !source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_owner
                                                            )
                                                        }
                                                        onClick={() => {
                                                            const index = source_activation.findIndex((item: any) => item.source_hid === source.hid)
                                                            const original_activation = source_activation[
                                                                index
                                                            ]
                                                            const original_is_global = original_activation?.is_global
                                                            const new_is_global = original_is_global ? false : true

                                                            const updated_activation = {
                                                                ...(original_activation || {}),  // carry over other properties if they exist
                                                                source_hid: source.hid,
                                                                is_global: new_is_global,
                                                            };

                                                            useSourceStore.setState(state => ({
                                                                source_activation:
                                                                    index >= 0
                                                                        ? state.source_activation.map((item: any, i: any) => i === index ? updated_activation : item)
                                                                        : [...state.source_activation, updated_activation]
                                                            }));
                                                            updateSourceActivation(setError, source.hid, original_activation, updated_activation)
                                                        }}
                                                    >
                                                        {source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_global ? (
                                                            <Globe />
                                                        ) : (
                                                            <ListCollapse />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        type='submit'
                                                        className='!w-fit ml-2'
                                                        disabled={
                                                            (
                                                                source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_mandatory &&
                                                                !source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_owner
                                                            )
                                                        }
                                                        onClick={() => {
                                                            const index = source_activation.findIndex((item: any) => item.source_hid === source.hid)
                                                            const original_activation = source_activation[
                                                                index
                                                            ]
                                                            const original_is_mandatory = original_activation?.is_mandatory
                                                            const new_is_mandatory = original_is_mandatory ? false : true

                                                            const updated_activation = {
                                                                ...(original_activation || {}),  // carry over other properties if they exist
                                                                source_hid: source.hid,
                                                                is_mandatory: new_is_mandatory,
                                                            };

                                                            useSourceStore.setState(state => ({
                                                                source_activation:
                                                                    index >= 0
                                                                        ? state.source_activation.map((item: any, i: any) => i === index ? updated_activation : item)
                                                                        : [...state.source_activation, updated_activation]
                                                            }));
                                                            updateSourceActivation(setError, source.hid, original_activation, updated_activation)
                                                        }}
                                                    >
                                                        {source_activation[source_activation.findIndex((item: any) => item.source_hid === source.hid)]?.is_mandatory ? (
                                                            <Lock className='mt-auto mb-auto' />
                                                        ) : (
                                                            <LockKeyholeOpen className='mt-auto mb-auto' />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className='!w-56'>
                                                {openDeleteSource != source.hid ? (
                                                    <div className='flex flex-row justify-end gap-2'>
                                                        {!source.pipeline_uploaded ? (
                                                            <>
                                                                <span className='mt-auto mb-auto'>
                                                                    {typeof uploadProgress[source.hid] === 'number'
                                                                        ? Math.round(uploadProgress[source.hid]!)
                                                                        : 0}
                                                                </span>
                                                                <Loader2 className='animate-spin mt-auto mb-auto' />
                                                            </>
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
                                                        )}
                                                        {source.is_owner ? (
                                                            <Button
                                                                type='submit'
                                                                className='!w-[12px] bg-destructive ml-2'
                                                                onClick={() => {
                                                                    setOpenDeleteSource(source.hid)
                                                                }}
                                                            >
                                                                <Trash />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                type='submit'
                                                                className='!w-[12px] ml-2'
                                                                disabled
                                                            >
                                                                <ShieldCheck />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    openDeleteSource === source.hid && (
                                                        <form onSubmit={(e) => {
                                                            e.preventDefault()
                                                            setValue('source_hid', source.hid)
                                                            handleSubmit(onSubmit)()
                                                        }}>
                                                            <div className="grid gap-6">
                                                                <div className="w-full flex flex-col gap-4">
                                                                    <div className="flex items-center space-x-2 gap-1 justify-end">
                                                                        <Controller
                                                                            control={control}
                                                                            name="confirm"
                                                                            rules={{ required: true }}
                                                                            render={({ field: { onChange } }) => (
                                                                                <Checkbox
                                                                                    checked={watch('confirm')} // Binds the checked state to the value
                                                                                    defaultSelected={watch('confirm')}
                                                                                    onChange={onChange} // Updates the value when checkbox state changes
                                                                                    className={`rounded-lg border border-destructive focus:outline-none focus:ring-2 focus:ring-blue-500 mt-auto mb-auto`}
                                                                                >
                                                                                    Confirm
                                                                                </Checkbox>
                                                                            )}
                                                                        />
                                                                        {sourceLoading.deleteSource ? (
                                                                            <Button disabled className="w-8 mt-auto mb-auto">
                                                                                <Loader2 className="animate-spin" />
                                                                            </Button>
                                                                        ) : (
                                                                            <>
                                                                                <Button
                                                                                    type='submit'
                                                                                    className='w-8 mt-auto mb-auto'
                                                                                >
                                                                                    <Trash />
                                                                                </Button>
                                                                                <Button className='w-8 mt-auto mb-auto' onClick={() => { setOpenDeleteSource(null) }}> <X /> </Button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    )
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet >
    )
}
export function DeleteRabiit(props: { rabiit_hid: string, setOpenDeleteNote: any }) {
    const {
        deleteRabiit,
        noteLoading
    } = useNoteStore(
        useShallow((state) => ({
            deleteRabiit: state.deleteRabiit,
            noteLoading: state.loading,
        })),
    )
    const noteDeleteFormSchema = z.object({
        confirm: z.literal(true),
    })
    type noteDeleteFormType = z.infer<typeof noteDeleteFormSchema>
    const { handleSubmit, control, setError } = useForm<noteDeleteFormType>(
        { resolver: zodResolver(noteDeleteFormSchema) }
    )
    const onSubmit: SubmitHandler<noteDeleteFormType> = (data) => {
        if (data.confirm) {
            deleteRabiit(
                setError,
                props.rabiit_hid,
            )
        }
    }
    return (
        <form>
            <div className="grid gap-6">
                <div className="w-full flex flex-col gap-4">
                    <div className="flex items-center space-x-2 gap-1 justify-end">
                        <Controller
                            control={control}
                            name="confirm"
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    checked={value} // Binds the checked state to the value
                                    onChange={onChange} // Updates the value when checkbox state changes
                                    className={`rounded-lg border border-destructive focus:outline-none focus:ring-2 focus:ring-blue-500 mt-auto mb-auto`}
                                >
                                    Confirm
                                </Checkbox>
                            )}
                        />
                        {noteLoading.deleteRabiit ? (
                            <Button disabled className="w-8 mt-auto mb-auto">
                                <Loader2 className="animate-spin" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type='button'
                                    className='w-8 mt-auto mb-auto'
                                    onClick={() => { handleSubmit(onSubmit)() }}
                                >
                                    <Trash />
                                </Button>
                                <Button className='w-8 mt-auto mb-auto' onClick={() => { props.setOpenDeleteNote(null) }}> <X /> </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}
export function SheetRabbit(props: { is_general_tutor: boolean, lesson_hid: string, allow_propagration?: boolean }) {
    const {
        isMdScreen,
    } = useAppStore(
        useShallow((state) => ({
            isMdScreen: state.isMdScreen,
        })),
    )
    const {
        streamLoading
    } = useStreamStore(
        useShallow((state) => ({
            streamLoading: state.loading,
        })),
    )
    const {
        highlightedText,
        selectedImage,
        rabiitsSheet,
        setRabiitsSheet,

        rabiits,

        createRabiit,
        getRabiits,
        noteLoading,
    } = useNoteStore(
        useShallow((state) => ({
            highlightedText: state.highlightedText,
            selectedImage: state.selectedImage,
            rabiitsSheet: state.rabiitsSheet,
            setRabiitsSheet: state.setRabiitsSheet,

            rabiits: state.rabiits,

            createRabiit: state.createRabiit,
            getRabiits: state.getRabiits,
            noteLoading: state.loading,
        })),
    )
    const [openNew, setOpenNew] = useState(false)
    const [expandedImage, setExpandedImage] = useState(false)


    const [activePrompt, setActivePrompt] = useState<any>(undefined);
    const [activeRabiit, setActiveRabiit] = useState(undefined);
    const [openDeleteRabiit, setOpenDeleteRabiit] = useState<any | null>(null)
    const FormSchema = z.object({
        prompt: z.string().min(3, 'min 3 characters.'),
    })
    type FormType = z.infer<typeof FormSchema>


    const { setValue, reset, handleSubmit, setError, formState: { errors } } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    })
    const onSubmit: SubmitHandler<FormType> = (data) => {
        if (data.prompt) {
            if (!errors.prompt) {
                createRabiit(setError, props.is_general_tutor, props.lesson_hid, highlightedText, data.prompt, selectedImage).then((data) => {
                    reset();
                    setActiveRabiit(data.hid)
                    setOpenNew(false)
                })
            }
        }
    }
    const prevRabiitsLength = useRef(rabiits?.length)

    useEffect(() => {
        const prevLength = prevRabiitsLength?.current
        const currLength = rabiits?.length

        if (typeof currLength === 'number' && typeof prevLength === 'number' && currLength > prevLength && rabiits[0]?.hid) {
            setActiveRabiit(rabiits[0]?.hid)
        } else if (rabiits?.length === 1) {
            setActiveRabiit(rabiits[0]?.hid)
        }

        prevRabiitsLength.current = currLength
    }, [rabiits])
    return (
        <Sheet open={rabiitsSheet} onOpenChange={setRabiitsSheet}>
            <SheetTrigger asChild onClick={(e) => {
                e.preventDefault()
                setRabiitsSheet(true)
            }}>
                <span className={`${button_style} ml-1 flex flex-row`}
                    onClick={(e) => {
                        if (!props.allow_propagration) {
                            e.stopPropagation();
                        }
                        if (rabiits === null) {
                            getRabiits(setError, props.is_general_tutor, props.lesson_hid)
                        }
                    }}
                >
                    <Rabbit size={14} className={`${icon_style} !stroke-primary`} />
                </span>
            </SheetTrigger>
            <SheetContent hideClose={false} className={`${isMdScreen ? '!min-w-full p-2' : '!min-w-[85dvw]'}`}>
                <SheetHeader>
                    <SheetTitle className='flex flex-row'><Rabbit size={45} className='!w-6 !h-6 mr-2' /> RABIITs</SheetTitle>
                    <SheetDescription>
                        RABIITs: Rapid Analysis and Breakdown of Important Ideas and Topics.
                    </SheetDescription>
                    <div className='flex flex-col w-full flex-wrap gap-2 justify-start mt-4'>
                        {highlightedText && (
                            <div className={`${isMdScreen ? 'w-full p-2' : 'w-[80%] p-4'} m-auto border border-primary/35 rounded-xl mt-4`}>
                                Highlighted Text:
                                <span
                                    className='w-full flex flex-row mt-auto mb-auto overflow-hidden justify-start text-nowrap text-md'
                                    style={{
                                        WebkitMaskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                        maskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                    }}
                                >
                                    {highlightedText}
                                </span>
                            </div>
                        )}
                        {selectedImage && (
                            <div className={`${isMdScreen ? 'w-full p-2' : 'w-[80%] p-4'} m-auto border border-primary/35 rounded-xl mt-4`}>
                                Selected Image:
                                <span
                                    className='w-full flex flex-row mt-auto mb-auto overflow-hidden justify-start text-nowrap text-md'
                                    style={{
                                        WebkitMaskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                        maskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                    }}
                                >
                                    <img src={selectedImage} className='m-auto max-w-[20%]' />
                                </span>
                            </div>
                        )}

                        <Button className={`w-44 text-md !p-[10px] !h-auto mt-3 ml-4 ${openNew && 'hidden'}`} variant={'default'} onClick={() => {
                            setOpenNew(openNew !== true)
                        }}>
                            <Rabbit size={25} className='!w-4 !h-4' /> New Rabiit
                        </Button>
                    </div>
                </SheetHeader>
                <div className={`
                        flex flex-row justify-center
                        ${!openNew && 'hidden'}
                    `}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 border-2 border-priamry/45 p-4 rounded-3xl">
                        <div className={`
                        flex flex-row flex-wrap justify-center gap-2 w-full m-auto p-2
                        `}>
                            <Button
                                type='button'
                                variant={activePrompt === '1' ? 'outline' : 'default'}
                                onClick={() => {
                                    setValue('prompt', 'Explain this like im 5')
                                    setActivePrompt('1')
                                    setActivePrompt(activePrompt === '1' ? undefined : '1')
                                }}
                            >
                                <Baby className='mr-1 mt-auto mb-auto' /> Explain like im 5
                            </Button>
                            <Button
                                type='button'
                                variant={activePrompt === '5' ? 'outline' : 'default'}
                                onClick={() => {
                                    setValue('prompt', 'Explain this in as much detail as possible, make it a technical dive.')
                                    setActivePrompt(activePrompt === '5' ? undefined : '5')
                                }}
                            >
                                <Target className='mr-1 mt-auto mb-auto' /> Techinical DeepDive
                            </Button>
                            <Button
                                type='button'
                                variant={activePrompt === '2' ? 'outline' : 'default'}
                                onClick={() => {
                                    setValue('prompt', 'Break this down in simple components')
                                    setActivePrompt('2')
                                    setActivePrompt(activePrompt === '2' ? undefined : '2')
                                }}
                            >
                                <Shapes className='mr-1 mt-auto mb-auto' /> Break it down
                            </Button>
                            <Button
                                type='button'
                                variant={activePrompt === '3' ? 'outline' : 'default'}
                                onClick={() => {
                                    setValue('prompt', 'Define the key terms in this extract')
                                    setActivePrompt(activePrompt === '3' ? undefined : '3')
                                }}
                            >
                                <KeyRound className='mr-1 mt-auto mb-auto' /> Define key terms
                            </Button>
                            <Button
                                type='button'
                                variant={activePrompt === '4' ? 'outline' : 'default'}
                                onClick={() => {
                                    setValue('prompt', 'Give me examples of this')
                                    setActivePrompt(activePrompt === '4' ? undefined : '4')
                                }}
                            >
                                <Command className='mr-1 mt-auto mb-auto' /> Give me examples
                            </Button>
                        </div>
                        <div className="flex flex-col flex-wrap justify-center gap-2 w-full m-auto p-2">
                            <Button
                                type='button'
                                className='w-44 m-auto'
                                variant={activePrompt === '6' ? 'secondary' : 'default'}
                                onClick={() => {
                                    setValue('prompt', 'Explain this like im 5')
                                    setActivePrompt('6')
                                    setActivePrompt(activePrompt === '6' ? undefined : '6')
                                }}
                            >
                                <Settings className='mr-1 mt-auto mb-auto' /> Custom
                            </Button>
                            <Input
                                type="text"
                                placeholder="Ask A Specific Question..."
                                className={`
                                    rounded-md border border-gray-300 p-2 text-sm m-auto
                                    focus:outline-none focus:ring-2 focus:ring-primary
                                    ${activePrompt !== '6' && 'hidden'}
                                    ${isMdScreen ? 'w-[94%]' : 'w-[75%]'}
                                `}
                                onChange={(e) => {
                                    setValue('prompt', e.target.value)
                                }}
                            />
                        </div>
                        <div className='w-full flex flex-row justify-between my-4'>
                            <div className='w-40'>
                                {noteLoading.createRabiit ? (
                                    <Button disabled className="w-full ">
                                        <Loader2 className="animate-spin" />
                                    </Button>
                                ) : (
                                    <Button
                                        type='submit' className='w-full '
                                        disabled={!activePrompt}
                                    > Create <Rabbit /></Button>
                                )}
                            </div>
                        </div>
                        <Button type='button' className='block w-44 ml-auto mt-2' variant={'destructive'} onClick={() => setOpenNew(false)}> Close </Button>
                    </form>
                </div>
                {noteLoading.getRabiits ? (
                    <div className='flex flex-col gap-2 mt-8'>
                        <Skeleton className="w-[94%] h-[48px] rounded-xl" />
                        <Skeleton className="w-[94%] h-[48px] rounded-xl" />
                        <Skeleton className="w-[94%] h-[48px] rounded-xl" />
                    </div>
                ) : (
                    !rabiits || rabiits.length == 0 ? (
                        <span className='flex flex-row w-fit m-auto mt-16'>
                            You have not created any items! <HeartCrack className='ml-4 mt-auto mb-auto stroke-red-400' />
                        </span>
                    ) : (
                        <Accordion
                            type="single"
                            value={typeof activeRabiit === 'string' ? String(activeRabiit) : undefined}
                            className={`${isMdScreen ? 'w-full' : 'w-[97%]'} mt-8 m-auto mb-[50vh]`}
                        >
                            {noteLoading.createRabiit && (
                                <div className='flex flex-col gap-2 mt-8'>
                                    <Skeleton className="w-[97%] h-[48px] rounded-xl" />
                                </div>
                            )}
                            <div className='flex flex-row justify-end w-full p-4 mb-2'>
                                {streamLoading.streaming && (<Pulsing className='ml-auto mt-4 w-fit' />)}
                            </div>
                            {rabiits.map((rabiit: any) => (
                                <AccordionItem
                                    value={String(rabiit.hid)}
                                    className="border-0 mt-1"
                                    key={`rabiit_item_${rabiit.hid}`}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                    }}
                                >
                                    <div className={`${!isMdScreen && 'pl-1 ml-2'}`}>
                                        <div
                                            className={`
                                        relative w-full h-[48px] p-1 flex flex-row justify-start pl-2 rounded-lg
                                        border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground
                                        hover:cursor-pointer
                                    `}

                                            onClick={(event) => {
                                                event.stopPropagation();
                                                event.preventDefault();
                                                setActiveRabiit(rabiit.hid !== activeRabiit ? rabiit.hid : undefined)
                                            }}
                                        >

                                            <span
                                                className='w-full flex flex-row mt-auto mb-auto overflow-hidden justify-start text-nowrap text-md'
                                                style={{
                                                    WebkitMaskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                                    maskImage: 'linear-gradient(90deg, black 70%, transparent 100%)',
                                                }}
                                            >
                                                <Rabbit size={6} className={`${icon_style} !stroke-primary mt-auto mb-auto mr-4`} />
                                                {rabiit.name}
                                                {rabiit.highlighted_text || rabiit.selected_image_url && (
                                                    <MoveRight className='mt-auto mb-auto mx-4' />
                                                )}
                                                {rabiit.highlighted_text && (rabiit.highlighted_text)}
                                                {rabiit.selected_image_url && (rabiit.selected_image_url.split('/').at(-1))}
                                            </span>
                                        </div>
                                        <AccordionContent>
                                            <div className={`
                                                flex flex-col text-balance
                                                ${isMdScreen ? 'w-full p-2' : 'ml-4 p-4 gap-4 w-[90%] border-l border-primary/35'}
                                            `}>
                                                <span className={`
                                                    border-l border-primary/25 text-primary/60
                                                    ${isMdScreen ? 'pl-2' : 'ml-4 pl-2'}
                                                `}
                                                >
                                                    {rabiit.prompt} <br /> <br />
                                                    {rabiit.highlighted_text && (rabiit.highlighted_text)}
                                                    {rabiit.selected_image_url && (
                                                        <img
                                                            src={rabiit.selected_image_url}
                                                            className={`
                                                        m-auto
                                                        ${expandedImage ? 'max-w-[65%]' : 'max-w-[15%]'}
                                                        !border-2 border-info
                                                        rounded-xl 
                                                        shadow-md
                                                        dark:shadow-gray-400 
                                                        hover:shadow-lg
                                                        hover:cursor-pointer
                                                        dark:hover:shadow-gray-200 
                                                        `}
                                                            onClick={() => { setExpandedImage(expandedImage === false) }}
                                                        />
                                                    )}
                                                </span>
                                                <div className='flex flex-row  m-auto !min-h-full !break-words text-pretty px-1 md:px-2 dark:text-primary/80 w-full'>
                                                    <div className={`
                                                            flex flex-col justify-between text-break text-wrap w-[min(98%,900px)] mx-auto
                                                            `}
                                                    >
                                                        <h1 className="!text-[16px] underline underline-offset-4 font-medium mb-8"> {rabiit.content['response_title']} </h1>
                                                        {rabiit?.content?.paragraphs?.map((paragraph: any, paragraph_idx: number) => (
                                                            <div key={`rabiit_${rabiit.hid}_paragraph_${paragraph_idx}`} className="mb-4">
                                                                <p className="text-base leading-relaxed ml-2">
                                                                    <span className="font-bold">{paragraph?.paragraph_heading}:</span>{' '}
                                                                    <Markdown
                                                                        className={`!inline  ${paragraph?.citations?.[0]?.split('_')[0] === 'null' && 'underline decoration-warning/30 underline-offset-4'}`}
                                                                        remarkPlugins={[remarkMath, remarkGfm]}
                                                                        rehypePlugins={[
                                                                            rehypeRaw,
                                                                            rehypeKatex as any,
                                                                            [rehypeHighlight, { ignoreMissing: true, plainTextInjection: true }],
                                                                        ]}
                                                                        components={{
                                                                            citation: ({ children }: any) => {
                                                                                const data = JSON.parse(children || '{}');
                                                                                return <InlineCitation data={data} />;
                                                                            },
                                                                        } as any}
                                                                    >
                                                                        {
                                                                            formatMath(paragraph?.text) +
                                                                            '<span className="ml-1">' +
                                                                            (paragraph?.citations || [])
                                                                                .map((item: any) =>
                                                                                    `<citation>${JSON.stringify({ data: item })}</citation>`
                                                                                )
                                                                                .join('') +
                                                                            '</span>'
                                                                        }
                                                                    </Markdown>
                                                                </p>
                                                            </div>
                                                        ))}
                                                        {streamLoading.streaming && (<Pulsing className='ml-auto mt-4' />)}
                                                    </div>
                                                </div>
                                                {!streamLoading.streaming && (
                                                    openDeleteRabiit != rabiit.hid ? (
                                                        <Button
                                                            type='submit'
                                                            className='!w-[12px] bg-destructive ml-auto p-4'
                                                            onClick={() => {
                                                                setOpenDeleteRabiit(rabiit.hid)
                                                            }}
                                                        >
                                                            <Trash className='!w-[12px]' />
                                                        </Button>
                                                    ) : (
                                                        <DeleteRabiit rabiit_hid={rabiit.hid} setOpenDeleteNote={setOpenDeleteRabiit} />
                                                    )
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </div>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )
                )
                }
            </SheetContent>
        </Sheet >
    )
}

export function ChatInput(props: {
    is_general_tutor: boolean,
}) {
    const {
        generalTutorLesson,
    } = useGeneralTutorStore(
        useShallow((state) => ({
            generalTutorLesson: state.generalTutorLesson,
        })),
    )
    const {
        resetNotes,
    } = useNoteStore(
        useShallow((state) => ({
            resetNotes: state.resetNotes,
        })),
    )
    const {
        streamLoading,
    } = useStreamStore(
        useShallow((state) => ({
            streamLoading: state.loading,
        })),
    )

    var object_hid: any = null
    var lesson_hid: any = null
    if (props.is_general_tutor) {
        object_hid = 'space_hid' in generalTutorLesson ? generalTutorLesson.space_hid : ''
    }

    if (props.is_general_tutor) {
        lesson_hid = 'hid' in generalTutorLesson ? generalTutorLesson.hid : ''
    }
    useEffect(() => {
        resetNotes()
    }, [generalTutorLesson])
    return (
        <div className={`
        flex flex-col
        rounded-t-xl rounded-b-0
        p-2 pb-0 mb-0 w-full m-auto bg-secondary/85 !backdrop-blur-md
        pt-4
        `}
            style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0.1%, black 6%)',
                maskImage: 'linear-gradient(to bottom, transparent 0.1%, black 6%)',
            }}
        >
            <div className='flex flex-row justify-between text-xs border-t border-primary/50 pt-2 mt-1 pb-2'>
                <div className='flex flex-row justify-start'>
                    <SheetSources is_general_tutor={props.is_general_tutor} object_hid={object_hid} />
                    <span className={`${button_style} ml-1 flex flex-row`}
                        onClick={() => {
                            useGeneralTutorStore.setState(({
                                learningMode: useGeneralTutorStore.getState().learningMode === 'reading' ? 'concepts' : 'reading'
                            }))
                        }}
                    >
                        <Blocks size={14} className={`${icon_style} !stroke-primary`} />
                    </span>
                    <Separator orientation="vertical" className="ml-2 mr-2 bg-primary/30 !h-[85%] mt-auto mb-auto" />
                </div>
                <div className='flex flex-row justify-center w-full'>
                    {useGeneralTutorStore.getState().learningMode === 'reading' && (
                        <SlidesProgressDisplay />
                    )}
                </div>
                <div className='flex flex-row-reverse justify-between'>
                    <span className={`${button_style} ml-1 flex flex-row`}
                        onClick={() => {
                            if ('source' in generalTutorLesson) {
                                window.open(generalTutorLesson?.source?.url, '_blank');
                            }
                        }}
                    >
                        <BookOpen size={14} className={`${icon_style} !stroke-primary`} />
                    </span>
                    <SheetRabbit is_general_tutor={props.is_general_tutor} lesson_hid={lesson_hid} />
                    <Separator orientation="vertical" className="ml-2 mr-2 bg-primary/30 !h-[85%] mt-auto mb-auto" />
                    {streamLoading.streaming && (
                        <Pulsing className='mt-auto mb-auto' />
                    )}
                </div>
            </div>
        </div >
    );
}
